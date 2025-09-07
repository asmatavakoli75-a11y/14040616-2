import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { submitAssessment } from '../../store/slices/assessmentSlice';
import { useToast } from '../../context/ToastContext';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import AssessmentProgress from './components/AssessmentProgress';
import QuestionnaireForm from './components/QuestionnaireForm';
import BodyMapSVG from './components/BodyMapSVG';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import CompletionModal from './components/CompletionModal';

const MultiStepAssessment = () => {
  const navigate = useNavigate();
  const { questionnaireId } = useParams();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // Zero-indexed
  const [responses, setResponses] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedBodyRegions, setSelectedBodyRegions] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const totalSteps = questionnaireData?.questions?.length || 0;
  const assessmentNames = questionnaireData?.questions?.map((q, index) =>
    `${currentLanguage === 'fa' ? 'سوال' : 'Question'} ${index + 1}`
  ) || [];

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/questionnaires/${questionnaireId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questionnaire');
        }
        const data = await response.json();
        setQuestionnaireData(data);
      } catch (error) {
        console.error('Error fetching questionnaire:', error);
        addToast('Failed to load assessment.', 'error');
        navigate('/patient-login');
      } finally {
        setIsLoading(false);
      }
    };

    if (questionnaireId) {
      fetchQuestionnaire();
    }
  }, [questionnaireId, navigate, addToast]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    document.documentElement?.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');

    // Load saved progress
    const savedProgress = localStorage.getItem('assessment_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentStep(progress?.currentStep || 1);
      setResponses(progress?.responses || {});
      setCompletedSteps(progress?.completedSteps || []);
      setSelectedBodyRegions(progress?.selectedBodyRegions || []);
      setLastSaved(progress?.lastSaved ? new Date(progress.lastSaved) : null);
    }

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const autoSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const progressData = {
      currentStep,
      responses,
      completedSteps,
      selectedBodyRegions,
      lastSaved: new Date()?.toISOString()
    };
    
    localStorage.setItem('assessment_progress', JSON.stringify(progressData));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    setIsSaving(false);
  };

  const handleResponseChange = (questionKey, value) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
    setHasUnsavedChanges(true);
    
    // Auto-save after 2 seconds of inactivity
    setTimeout(() => {
      if (hasUnsavedChanges) {
        autoSave();
      }
    }, 2000);
  };

  const handleBodyRegionClick = (regionId) => {
    setSelectedBodyRegions(prev => {
      const newRegions = prev?.includes(regionId)
        ? prev?.filter(id => id !== regionId)
        : [...prev, regionId];
      
      setHasUnsavedChanges(true);
      return newRegions;
    });
  };

  const handleNext = () => {
    if (!completedSteps?.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    if (currentStep === totalSteps - 1) { // -1 because currentStep is 0-indexed
      setShowCompletionModal(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
    autoSave();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    await autoSave();
    navigate('/patient-login');
  };

  const handleCompleteAssessment = async () => {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (!session || !session._id) {
      addToast('You must be logged in to submit an assessment.', 'error');
      navigate('/patient-login');
      return;
    }

    const assessmentData = {
      patientId: session._id,
      questionnaireId,
      responses,
      // Note: selectedBodyRegions is not part of the Assessment model yet.
      // This will be ignored by the backend for now.
    };

    try {
      await dispatch(submitAssessment(assessmentData)).unwrap();
      localStorage.removeItem('assessment_progress');
      addToast('Assessment submitted successfully!', 'success');
      navigate('/assessment-results'); // Or a patient dashboard
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      addToast(currentLanguage === 'fa' ? 'خطا در ارسال ارزیابی. لطفاً دوباره تلاش کنید.' : 'Failed to submit assessment. Please try again.', 'error');
      setShowCompletionModal(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!questionnaireData || !questionnaireData.questions) return null;
    const question = questionnaireData.questions[currentStep];
    // We need to wrap it in a 'questionnaire' like object for QuestionnaireForm
    return {
      title: question.text,
      code: `Q${currentStep + 1}`,
      description: '', // Individual questions don't have descriptions
      instructions: '', // Or instructions
      questions: [question] // Pass the single question in an array
    };
  };

  const assessmentSummary = {
    totalAnswered: Object.keys(responses)?.length + (selectedBodyRegions?.length > 0 ? 1 : 0),
    completedSections: completedSteps?.length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (!questionnaireData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Could not load assessment. Please try again later.</p>
      </div>
    );
  }

  const currentQuestion = questionnaireData.questions[currentStep];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-heading">
                {questionnaireData.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {questionnaireData.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patient-login')}
                iconName="Home"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'بازگشت' : 'Back to Home'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveAndExit}
                iconName="Save"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'ذخیره و خروج' : 'Save & Exit'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <AssessmentProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              completedSteps={completedSteps}
              assessmentNames={assessmentNames}
              currentLanguage={currentLanguage}
            />
            
            {/* Quick Stats */}
            <div className="bg-card rounded-lg border shadow-clinical p-4 mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {currentLanguage === 'fa' ? 'آمار سریع' : 'Quick Stats'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'پاسخ داده شده:' : 'Answered:'}
                  </span>
                  <span className="font-data text-primary">
                    {assessmentSummary?.totalAnswered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'تکمیل شده:' : 'Completed:'}
                  </span>
                  <span className="font-data text-success">
                    {completedSteps?.length}/{totalSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'زمان تخمینی:' : 'Est. Time:'}
                  </span>
                  <span className="font-data text-foreground">
                    {Math.max(1, totalSteps - currentStep + 1) * 3} {currentLanguage === 'fa' ? 'دقیقه' : 'min'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentQuestion && currentQuestion.questionType === 'bodymap' ? (
              <div className="space-y-6">
                <BodyMapSVG
                  selectedRegions={selectedBodyRegions}
                  onRegionClick={handleBodyRegionClick}
                  currentLanguage={currentLanguage}
                />
                
                <QuestionnaireForm
                  currentStep={currentStep}
                  questionnaire={getCurrentQuestion()}
                  responses={responses}
                  onResponseChange={handleResponseChange}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSaveAndExit={handleSaveAndExit}
                  currentLanguage={currentLanguage}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === totalSteps - 1}
                />
              </div>
            ) : (
              <QuestionnaireForm
                currentStep={currentStep}
                questionnaire={getCurrentQuestion()}
                responses={responses}
                onResponseChange={handleResponseChange}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSaveAndExit={handleSaveAndExit}
                currentLanguage={currentLanguage}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === totalSteps - 1}
              />
            )}
          </div>
        </div>
      </main>
      <AutoSaveIndicator
        lastSaved={lastSaved}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        currentLanguage={currentLanguage}
      />
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={handleCompleteAssessment}
        currentLanguage={currentLanguage}
        assessmentSummary={assessmentSummary}
      />
    </div>
  );
};

export default MultiStepAssessment;