import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 10, 
  completedSteps = [], 
  stepLabels = [],
  showLabels = true,
  orientation = 'horizontal',
  size = 'default',
  className = ''
}) => {
  const getCurrentLanguage = () => {
    return document.documentElement?.getAttribute('lang') || 'en';
  };

  const currentLanguage = getCurrentLanguage();

  const defaultStepLabels = [
    currentLanguage === 'fa' ? 'اطلاعات پایه' : 'Basic Info',
    currentLanguage === 'fa' ? 'تاریخچه پزشکی' : 'Medical History',
    currentLanguage === 'fa' ? 'علائم فعلی' : 'Current Symptoms',
    currentLanguage === 'fa' ? 'درد و ناراحتی' : 'Pain Assessment',
    currentLanguage === 'fa' ? 'فعالیت روزانه' : 'Daily Activities',
    currentLanguage === 'fa' ? 'وضعیت روانی' : 'Mental Health',
    currentLanguage === 'fa' ? 'سبک زندگی' : 'Lifestyle',
    currentLanguage === 'fa' ? 'محیط کار' : 'Work Environment',
    currentLanguage === 'fa' ? 'ارزیابی نهایی' : 'Final Assessment',
    currentLanguage === 'fa' ? 'تکمیل' : 'Completion'
  ];

  const labels = stepLabels?.length > 0 ? stepLabels : defaultStepLabels;
  const progressPercentage = (completedSteps?.length / totalSteps) * 100;

  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (completedSteps?.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    default: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const StepIndicator = ({ stepIndex, status, label }) => (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} items-center`}>
      <div className={`assessment-step ${status} ${sizeClasses?.[size]} font-medium`}>
        {status === 'completed' ? (
          <Icon name="Check" size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        ) : (
          <span>{stepIndex + 1}</span>
        )}
      </div>
      {showLabels && (
        <span className={`${
          orientation === 'vertical' ? 'mt-2 text-center' : 'ml-2 rtl:mr-2 rtl:ml-0'
        } text-xs font-medium ${
          status === 'completed' ? 'text-success' :
          status === 'current'? 'text-primary' : 'text-muted-foreground'
        } transition-clinical`}>
          {label}
        </span>
      )}
    </div>
  );

  const ConnectorLine = ({ isCompleted }) => (
    <div className={`${
      orientation === 'vertical' ? 'w-0.5 h-8 mx-auto' : 'h-0.5 flex-1 mx-2'
    } ${isCompleted ? 'bg-success' : 'bg-border'} transition-clinical`} />
  );

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        {/* Progress Summary */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'پیشرفت ارزیابی' : 'Assessment Progress'}
            </span>
            <span className="text-sm font-data text-primary">
              {completedSteps?.length}/{totalSteps}
            </span>
          </div>
          <div className="progress-clinical">
            <div 
              className="progress-clinical-bar" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(progressPercentage)}% {currentLanguage === 'fa' ? 'تکمیل شده' : 'Complete'}
          </p>
        </div>
        {/* Step Indicators */}
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex flex-col items-center">
            <StepIndicator 
              stepIndex={index} 
              status={getStepStatus(index)} 
              label={labels?.[index]} 
            />
            {index < totalSteps - 1 && (
              <ConnectorLine isCompleted={completedSteps?.includes(index + 1)} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {currentLanguage === 'fa' ? 'پیشرفت ارزیابی' : 'Assessment Progress'}
          </span>
          <span className="text-sm font-data text-primary">
            {completedSteps?.length}/{totalSteps}
          </span>
        </div>
        <div className="progress-clinical">
          <div 
            className="progress-clinical-bar animate-progress" 
            style={{ '--progress-width': `${progressPercentage}%`, width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {currentLanguage === 'fa' ? 'شروع' : 'Start'}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% {currentLanguage === 'fa' ? 'تکمیل' : 'Complete'}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentLanguage === 'fa' ? 'پایان' : 'End'}
          </span>
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: Math.min(totalSteps, 5) }, (_, index) => (
          <React.Fragment key={index}>
            <StepIndicator 
              stepIndex={index} 
              status={getStepStatus(index)} 
              label={showLabels ? labels?.[index] : ''} 
            />
            {index < Math.min(totalSteps, 5) - 1 && (
              <ConnectorLine isCompleted={completedSteps?.includes(index + 1)} />
            )}
          </React.Fragment>
        ))}
        
        {totalSteps > 5 && (
          <>
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-muted-foreground">
              <Icon name="MoreHorizontal" size={16} />
              <span className="text-xs">
                +{totalSteps - 5} {currentLanguage === 'fa' ? 'مرحله' : 'more'}
              </span>
            </div>
            <ConnectorLine isCompleted={completedSteps?.includes(totalSteps)} />
            <StepIndicator 
              stepIndex={totalSteps - 1} 
              status={getStepStatus(totalSteps - 1)} 
              label={showLabels ? labels?.[totalSteps - 1] : ''} 
            />
          </>
        )}
      </div>
      {/* Current Step Info */}
      {currentStep <= totalSteps && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {currentLanguage === 'fa' ? 'مرحله فعلی:' : 'Current Step:'} {labels?.[currentStep - 1]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentLanguage === 'fa' 
              ? `مرحله ${currentStep} از ${totalSteps} - ${Math.round((currentStep / totalSteps) * 100)}% تکمیل شده`
              : `Step ${currentStep} of ${totalSteps} - ${Math.round((currentStep / totalSteps) * 100)}% complete`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;