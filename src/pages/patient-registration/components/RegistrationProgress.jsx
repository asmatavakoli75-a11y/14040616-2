import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const RegistrationProgress = ({ 
  currentStep = 1, 
  totalSteps = 4,
  completedSections = [],
  className = '' 
}) => {
  const currentLanguage = useLanguage();

  const stepLabels = [
    currentLanguage === 'fa' ? 'اطلاعات شخصی' : 'Personal Info',
    currentLanguage === 'fa' ? 'سابقه پزشکی' : 'Medical History',
    currentLanguage === 'fa' ? 'تماس اضطراری' : 'Emergency Contact',
    currentLanguage === 'fa' ? 'رضایت‌نامه' : 'Consent'
  ];

  const progressPercentage = (completedSections?.length / totalSteps) * 100;

  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (completedSections?.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  const StepIndicator = ({ stepIndex, status, label }) => (
    <div className="flex flex-col items-center space-y-2">
      <div className={`assessment-step ${status} w-10 h-10 text-sm font-medium`}>
        {status === 'completed' ? (
          <Icon name="Check" size={16} />
        ) : (
          <span>{stepIndex + 1}</span>
        )}
      </div>
      <span className={`text-xs font-medium text-center max-w-20 leading-tight ${
        status === 'completed' ? 'text-success' :
        status === 'current'? 'text-primary' : 'text-muted-foreground'
      } transition-clinical`}>
        {label}
      </span>
    </div>
  );

  const ConnectorLine = ({ isCompleted }) => (
    <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-success' : 'bg-border'} transition-clinical`} />
  );

  return (
    <div className={`bg-card rounded-lg border shadow-clinical p-6 ${className}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            {currentLanguage === 'fa' ? 'پیشرفت ثبت‌نام' : 'Registration Progress'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentLanguage === 'fa' 
              ? `مرحله ${currentStep} از ${totalSteps}`
              : `Step ${currentStep} of ${totalSteps}`
            }
          </p>
        </div>
        <div className="text-right rtl:text-left">
          <div className="text-2xl font-bold text-primary font-data">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {currentLanguage === 'fa' ? 'تکمیل شده' : 'Complete'}
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="progress-clinical">
          <div 
            className="progress-clinical-bar animate-progress" 
            style={{ '--progress-width': `${progressPercentage}%`, width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{currentLanguage === 'fa' ? 'شروع' : 'Start'}</span>
          <span>{currentLanguage === 'fa' ? 'پایان' : 'Complete'}</span>
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <React.Fragment key={index}>
            <StepIndicator 
              stepIndex={index} 
              status={getStepStatus(index)} 
              label={stepLabels?.[index]} 
            />
            {index < totalSteps - 1 && (
              <ConnectorLine isCompleted={completedSections?.includes(index + 1)} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Current Step Info */}
      {currentStep <= totalSteps && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {currentLanguage === 'fa' ? 'مرحله فعلی:' : 'Current Step:'} {stepLabels?.[currentStep - 1]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentLanguage === 'fa' ?'لطفاً تمام فیلدهای الزامی را تکمیل کنید' :'Please complete all required fields to continue'
            }
          </p>
        </div>
      )}
      {/* Completion Status */}
      {progressPercentage === 100 && (
        <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              {currentLanguage === 'fa' ? 'ثبت‌نام آماده تکمیل است!' : 'Registration Ready to Complete!'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentLanguage === 'fa' ?'تمام بخش‌ها تکمیل شده‌اند. می‌توانید ثبت‌نام را نهایی کنید.' :'All sections completed. You can now finalize your registration.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistrationProgress;