import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CompletionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentLanguage,
  assessmentSummary 
}) => {
  if (!isOpen) return null;

  const completionStats = {
    totalQuestions: 87,
    answeredQuestions: assessmentSummary?.totalAnswered || 0,
    completionRate: Math.round(((assessmentSummary?.totalAnswered || 0) / 87) * 100),
    estimatedTime: '23 minutes'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border shadow-clinical-lg max-w-md w-full animate-fade-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'تکمیل ارزیابی' : 'Complete Assessment'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 'آماده ارسال نهایی' : 'Ready for final submission'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'خلاصه ارزیابی' : 'Assessment Summary'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">
                  {currentLanguage === 'fa' ? 'سوالات پاسخ داده شده:' : 'Questions Answered:'}
                </span>
                <div className="font-data text-primary">
                  {completionStats?.answeredQuestions}/{completionStats?.totalQuestions}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">
                  {currentLanguage === 'fa' ? 'درصد تکمیل:' : 'Completion Rate:'}
                </span>
                <div className="font-data text-success">
                  {completionStats?.completionRate}%
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">
                  {currentLanguage === 'fa' ? 'زمان صرف شده:' : 'Time Spent:'}
                </span>
                <div className="font-data text-foreground">
                  {completionStats?.estimatedTime}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">
                  {currentLanguage === 'fa' ? 'تاریخ:' : 'Date:'}
                </span>
                <div className="font-data text-foreground">
                  {new Date()?.toLocaleDateString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US')}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-primary">
                <p className="font-medium mb-1">
                  {currentLanguage === 'fa' ? 'مرحله بعد چیست؟' : 'What happens next?'}
                </p>
                <p>
                  {currentLanguage === 'fa' ?'پس از ارسال، نتایج شما تحلیل شده و گزارش جامع آماده خواهد شد. این فرآیند معمولاً کمتر از 2 دقیقه طول می‌کشد.' :'After submission, your responses will be analyzed and a comprehensive report will be generated. This process typically takes less than 2 minutes.'
                  }
                </p>
              </div>
            </div>
          </div>

          {completionStats?.completionRate < 80 && (
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm text-warning">
                  <p className="font-medium mb-1">
                    {currentLanguage === 'fa' ? 'توجه' : 'Notice'}
                  </p>
                  <p>
                    {currentLanguage === 'fa' ?'برخی سوالات پاسخ داده نشده‌اند. برای دقت بیشتر نتایج، توصیه می‌شود به سوالات باقی‌مانده پاسخ دهید.' :'Some questions remain unanswered. For more accurate results, we recommend completing the remaining questions.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              onClick={onClose}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'بازگشت' : 'Go Back'}
            </Button>
            
            <Button
              variant="default"
              onClick={onConfirm}
              iconName="Send"
              iconPosition="right"
              className="bg-success hover:bg-success/90"
            >
              {currentLanguage === 'fa' ? 'ارسال نهایی' : 'Submit Assessment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;