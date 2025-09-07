import React from 'react';
import Icon from '../../../components/AppIcon';

const AssessmentProgress = ({ 
  currentStep, 
  totalSteps, 
  completedSteps, 
  assessmentNames,
  currentLanguage 
}) => {
  const progressPercentage = (completedSteps?.length / totalSteps) * 100;
  
  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (completedSteps?.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-card rounded-lg border shadow-clinical p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'پیشرفت ارزیابی' : 'Assessment Progress'}
        </h2>
        <span className="text-sm font-data text-primary bg-primary/10 px-3 py-1 rounded-full">
          {completedSteps?.length}/{totalSteps}
        </span>
      </div>
      <div className="progress-clinical mb-4">
        <div 
          className="progress-clinical-bar animate-progress" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mb-4">
        <span>{currentLanguage === 'fa' ? 'شروع' : 'Start'}</span>
        <span className="font-medium text-primary">
          {Math.round(progressPercentage)}% {currentLanguage === 'fa' ? 'تکمیل' : 'Complete'}
        </span>
        <span>{currentLanguage === 'fa' ? 'پایان' : 'End'}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {assessmentNames?.slice(0, 10)?.map((name, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className={`assessment-step ${status} w-8 h-8 text-xs font-medium`}>
                {status === 'completed' ? (
                  <Icon name="Check" size={12} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`text-xs text-center leading-tight ${
                status === 'completed' ? 'text-success' :
                status === 'current'? 'text-primary' : 'text-muted-foreground'
              }`}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
      {currentStep <= totalSteps && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {currentLanguage === 'fa' ? 'مرحله فعلی:' : 'Current Step:'} {assessmentNames?.[currentStep - 1]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentProgress;