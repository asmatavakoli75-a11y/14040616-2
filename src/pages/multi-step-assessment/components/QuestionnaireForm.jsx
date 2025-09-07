import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const QuestionnaireForm = ({ 
  currentStep, 
  questionnaire, 
  responses, 
  onResponseChange, 
  onNext, 
  onPrevious, 
  onSaveAndExit,
  currentLanguage,
  isFirstStep,
  isLastStep 
}) => {
  const renderQuestion = (question, index) => {
    const questionKey = question._id; // Use the unique ID from the database
    const currentResponse = responses?.[questionKey] || '';

    switch (question?.type) {
      case 'radio':
        return (
          <div key={index} className="questionnaire-section">
            <div className="questionnaire-header">
              <h3 className="text-base font-medium text-foreground">
                {question?.question}
              </h3>
              {question?.required && (
                <span className="text-error text-sm">*</span>
              )}
            </div>
            <div className="space-y-3">
              {question?.options?.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-clinical">
                  <input
                    type="radio"
                    name={questionKey}
                    value={option?.value}
                    checked={currentResponse === option?.value}
                    onChange={(e) => onResponseChange(questionKey, e?.target?.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{option?.label}</span>
                    {option?.description && (
                      <p className="text-xs text-muted-foreground mt-1">{option?.description}</p>
                    )}
                  </div>
                  {option?.score !== undefined && (
                    <span className="text-xs font-data text-muted-foreground bg-muted px-2 py-1 rounded">
                      {option?.score}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 'scale':
        return (
          <div key={index} className="questionnaire-section">
            <div className="questionnaire-header">
              <h3 className="text-base font-medium text-foreground">
                {question?.question}
              </h3>
              {question?.required && (
                <span className="text-error text-sm">*</span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{question?.scaleLabels?.min || '0'}</span>
                <span>{question?.scaleLabels?.max || '10'}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {Array.from({ length: question?.scaleMax - question?.scaleMin + 1 }, (_, i) => {
                  const value = question?.scaleMin + i;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onResponseChange(questionKey, value?.toString())}
                      className={`w-10 h-10 rounded-full border-2 text-sm font-medium transition-clinical ${
                        currentResponse === value?.toString()
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border hover:border-primary hover:bg-primary/10'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {currentLanguage === 'fa' ?'روی عدد مورد نظر کلیک کنید' :'Click on the number that best represents your answer'
                }
              </p>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={index} className="questionnaire-section">
            <div className="questionnaire-header">
              <h3 className="text-base font-medium text-foreground">
                {question?.question}
              </h3>
              {question?.required && (
                <span className="text-error text-sm">*</span>
              )}
            </div>
            <textarea
              value={currentResponse}
              onChange={(e) => onResponseChange(questionKey, e?.target?.value)}
              placeholder={question?.placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-clinical"
            />
            {question?.maxLength && (
              <p className="text-xs text-muted-foreground mt-1">
                {currentResponse?.length}/{question?.maxLength} {currentLanguage === 'fa' ? 'کاراکتر' : 'characters'}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={index} className="questionnaire-section">
            <div className="questionnaire-header">
              <h3 className="text-base font-medium text-foreground">
                {question?.question}
              </h3>
              {question?.required && (
                <span className="text-error text-sm">*</span>
              )}
            </div>
            <div className="space-y-3">
              {question?.options?.map((option, optionIndex) => {
                const isChecked = Array.isArray(currentResponse) 
                  ? currentResponse?.includes(option?.value)
                  : currentResponse === option?.value;
                
                return (
                  <Checkbox
                    key={optionIndex}
                    label={option?.label}
                    description={option?.description}
                    checked={isChecked}
                    onChange={(e) => {
                      if (question?.multiple) {
                        const currentArray = Array.isArray(currentResponse) ? currentResponse : [];
                        const newArray = e?.target?.checked
                          ? [...currentArray, option?.value]
                          : currentArray?.filter(val => val !== option?.value);
                        onResponseChange(questionKey, newArray);
                      } else {
                        onResponseChange(questionKey, e?.target?.checked ? option?.value : '');
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="questionnaire-section">
            <Input
              label={question?.question}
              type={question?.inputType || 'text'}
              value={currentResponse}
              onChange={(e) => onResponseChange(questionKey, e?.target?.value)}
              placeholder={question?.placeholder}
              required={question?.required}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-clinical">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {questionnaire?.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {questionnaire?.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="FileText" size={20} className="text-primary" />
            <span className="text-sm font-data text-primary">
              {questionnaire?.code}
            </span>
          </div>
        </div>
        
        {questionnaire?.instructions && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-primary">
                {questionnaire?.instructions}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 space-y-6">
        {questionnaire?.questions?.map((question, index) => renderQuestion(question, index))}
      </div>
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstStep}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'قبلی' : 'Previous'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={onSaveAndExit}
              iconName="Save"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'ذخیره و خروج' : 'Save & Exit'}
            </Button>
          </div>

          <Button
            variant="default"
            onClick={onNext}
            iconName={isLastStep ? "Check" : "ChevronRight"}
            iconPosition="right"
          >
            {isLastStep 
              ? (currentLanguage === 'fa' ? 'تکمیل ارزیابی' : 'Complete Assessment')
              : (currentLanguage === 'fa' ? 'بعدی' : 'Next')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;