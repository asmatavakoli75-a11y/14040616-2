import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useLanguage } from '../../components/ui/LanguageToggle';
import { useToast } from '../../context/ToastContext';
import PatientHeader from './components/PatientHeader';
import AssessmentTimeline from './components/AssessmentTimeline';
import TrendAnalysis from './components/TrendAnalysis';
import ClinicalNotes from './components/ClinicalNotes';
// bring in the body map component from the original app.  It visualises pain points for different
// phases and views (front/back) and doesn’t rely on any of the redux store logic.  By
// importing it here we ensure users can still access the body map tab which existed in the
// legacy version of the app.  See src/pages/patient-profile/components/BodyMapVisualization.jsx for details.
import BodyMapVisualization from './components/BodyMapVisualization';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PatientProfile = () => {
  const currentLanguage = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { patientId } = useParams();

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        addToast(
          currentLanguage === 'fa'
            ? 'خطا در واکشی اطلاعات بیمار'
            : 'Error fetching patient data',
          'error'
        );
        navigate('/admin-dashboard'); // Redirect if patient not found
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId, navigate, addToast, currentLanguage]);

  const fetchSubData = useCallback(async () => {
    try {
      const [assessmentsRes, notesRes] = await Promise.all([
        fetch(`/api/assessments/patient/${patientId}`),
        fetch(`/api/notes/patient/${patientId}`),
      ]);

      if (!assessmentsRes.ok) throw new Error('Failed to fetch assessments');
      if (!notesRes.ok) throw new Error('Failed to fetch notes');

      const assessmentsData = await assessmentsRes.json();
      const notesData = await notesRes.json();

      setAssessments(assessmentsData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching sub-data:', error);
      addToast(
        currentLanguage === 'fa'
          ? 'خطا در واکشی داده‌های تکمیلی'
          : 'Error fetching supplementary data',
        'error'
      );
    }
  }, [patientId, addToast, currentLanguage]);

  useEffect(() => {
    if (patientId) {
      fetchSubData();
    }
  }, [patientId, fetchSubData]);

  const tabs = [
    {
      id: 'overview',
      name: currentLanguage === 'fa' ? 'نمای کلی' : 'Overview',
      icon: 'LayoutDashboard'
    },
    {
      id: 'assessments',
      name: currentLanguage === 'fa' ? 'ارزیابی‌ها' : 'Assessments',
      icon: 'ClipboardList'
    },
    {
      id: 'trends',
      name: currentLanguage === 'fa' ? 'روندها' : 'Trends',
      icon: 'TrendingUp'
    },
    // add a body map tab so clinicians can visualise patients’ pain regions.  This tab was
    // available in the original application and is conditionally labelled based on the
    // current language.
    {
      id: 'bodymap',
      name: currentLanguage === 'fa' ? 'نقشه درد بدن' : 'Body Map',
      icon: 'User'
    },
    {
      id: 'notes',
      name: currentLanguage === 'fa' ? 'یادداشت‌ها' : 'Notes',
      icon: 'FileText'
    }
  ];

  const handleSendReminder = () => {
    addToast(currentLanguage === 'fa' ? 'یادآوری ارسال شد' : 'Reminder sent successfully', 'success');
  };

  const handleGenerateReport = () => {
    addToast(currentLanguage === 'fa' ? 'گزارش در حال تولید است...' : 'Generating report...');
  };

  const handleEditPatient = () => {
    // Mock edit functionality
    console.log('Edit patient:', patientData?.id);
  };

  if (isLoading || !patientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">
            {currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageToggle position="top-right" />
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16 rtl:mr-16 rtl:ml-0' : 'ml-64 rtl:mr-64 rtl:ml-0'
        }`}>
          <div className="assessment-container py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mb-6">
              <button 
                onClick={() => navigate('/admin-dashboard')}
                className="hover:text-primary transition-clinical"
              >
                {currentLanguage === 'fa' ? 'داشبورد' : 'Dashboard'}
              </button>
              <Icon name="ChevronRight" size={14} className="rtl:rotate-180" />
              <button 
                onClick={() => navigate('/admin-dashboard')}
                className="hover:text-primary transition-clinical"
              >
                {currentLanguage === 'fa' ? 'بیماران' : 'Patients'}
              </button>
              <Icon name="ChevronRight" size={14} className="rtl:rotate-180" />
              <span className="text-foreground font-medium">
                {patientData?.firstName ? `${patientData.firstName} ${patientData.lastName}` : ''}
              </span>
            </div>

            {/* Patient Header */}
            <PatientHeader
              patient={patientData}
              onEdit={handleEditPatient}
              onSendReminder={handleSendReminder}
              onGenerateReport={handleGenerateReport}
              currentLanguage={currentLanguage}
            />

            {/* Tab Navigation */}
            <div className="card-clinical p-2 mb-6">
              <div className="flex items-center space-x-1 rtl:space-x-reverse overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-clinical whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <AssessmentTimeline 
                    assessments={assessments}
                    currentLanguage={currentLanguage}
                  />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TrendAnalysis currentLanguage={currentLanguage} />
                    <div className="card-clinical p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 font-heading">
                        {currentLanguage === 'fa' ? 'خلاصه وضعیت' : 'Status Summary'}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            {currentLanguage === 'fa' ? 'آخرین ارزیابی' : 'Last Assessment'}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {/* To be implemented with assessment data */}
                            N/A
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            {currentLanguage === 'fa' ? 'قرار ملاقات بعدی' : 'Next Appointment'}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {/* To be implemented */}
                            N/A
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            {currentLanguage === 'fa' ? 'تاریخ ثبت نام' : 'Registration Date'}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {new Date(patientData.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assessments' && (
                <AssessmentTimeline 
                  assessments={assessments}
                  currentLanguage={currentLanguage}
                />
              )}

              {activeTab === 'trends' && (
                <TrendAnalysis assessments={assessments} currentLanguage={currentLanguage} />
              )}

              {activeTab === 'bodymap' && (
                // render the body map visualisation using the component from the original
                // application.  Passing only currentLanguage is sufficient because the
                // component manages its own internal state for phases and view modes.
                <BodyMapVisualization currentLanguage={currentLanguage} />
              )}

              {activeTab === 'notes' && (
                <ClinicalNotes
                  notes={notes}
                  patientId={patientId}
                  currentLanguage={currentLanguage}
                  onNoteAdded={fetchSubData}
                />
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentLanguage === 'fa' ?'آخرین به‌روزرسانی: ۵ دقیقه پیش' :'Last updated: 5 minutes ago'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/multi-step-assessment')}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'ارزیابی جدید' : 'New Assessment'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    iconName="Printer"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'چاپ' : 'Print'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;