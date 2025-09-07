import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetPrediction } from '../../store/slices/predictionSlice';
import { useLanguage } from '../../components/ui/LanguageToggle';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

// Import components
import RiskPredictionPanel from './components/RiskPredictionPanel';
import AssessmentScoreCard from './components/AssessmentScoreCard';
import TrendAnalysisChart from './components/TrendAnalysisChart';
import ActionPanel from './components/ActionPanel';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { result: predictionResult, status: predictionStatus, error: predictionError } = useSelector((state) => state.prediction);
  const currentLanguage = useLanguage();

  // Clean up prediction state when leaving the page
  useEffect(() => {
    return () => {
      dispatch(resetPrediction());
    };
  }, [dispatch]);


  // Mock data for other sections that are not yet dynamic
  const mockAssessments = [ /* ... */ ];
  const mockShapValues = [ /* ... */ ];

  if (predictionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center space-y-4">
            <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto" />
            <h2 className="text-xl font-semibold">Analyzing Results...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (predictionError || !predictionResult) {
    return (
       <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
          <Icon name="AlertTriangle" size={48} className="text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {predictionError ? 'Error Generating Report' : 'No Assessment Found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {predictionError ? 'There was an error while processing your assessment.' : 'We could not find any assessment data to display.'}
          </p>
          <Button onClick={() => navigate('/multi-step-assessment')}>
            Start New Assessment
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* ... Page Header ... */}
        </div>

        <div className="space-y-8">
          <RiskPredictionPanel
            riskPercentage={predictionResult.riskScore}
            riskLevel={predictionResult.riskLevel}
            confidenceInterval={[
              Math.max(0, predictionResult.riskScore - 5),
              Math.min(100, predictionResult.riskScore + 5)
            ]}
            shapValues={mockShapValues} // Still using mock SHAP values
            onViewDetails={() => console.log('View risk details')}
          />

          {/* Other sections with mock data */}
          <div className="space-y-6">
            {/* ... AssessmentScoreCards ... */}
          </div>
          <TrendAnalysisChart selectedMetrics={['riskScore']} onMetricToggle={() => {}} />
          <ActionPanel onStartNewAssessment={() => navigate('/multi-step-assessment')} />
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          {/* ... */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentResults;