import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionPanel = ({ 
  patientData = {},
  onDownloadReport,
  onShareResults,
  onScheduleFollowup,
  onStartNewAssessment,
  className = '' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [shareOptions, setShareOptions] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleDownloadReport = async (format) => {
    setIsGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (onDownloadReport) {
        onDownloadReport(format);
      }
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleShare = (method) => {
    setShareOptions(false);
    if (onShareResults) {
      onShareResults(method);
    }
  };

  const nextAssessmentDate = new Date();
  nextAssessmentDate?.setMonth(nextAssessmentDate?.getMonth() + 1);

  const reportFormats = [
    {
      format: 'pdf',
      name: currentLanguage === 'fa' ? 'گزارش PDF' : 'PDF Report',
      description: currentLanguage === 'fa' ? 'گزارش کامل با نمودارها' : 'Complete report with charts',
      icon: 'FileText'
    },
    {
      format: 'excel',
      name: currentLanguage === 'fa' ? 'فایل Excel' : 'Excel File',
      description: currentLanguage === 'fa' ? 'داده‌های خام برای تحلیل' : 'Raw data for analysis',
      icon: 'Table'
    },
    {
      format: 'summary',
      name: currentLanguage === 'fa' ? 'خلاصه کوتاه' : 'Summary Report',
      description: currentLanguage === 'fa' ? 'خلاصه یک صفحه‌ای' : 'One-page summary',
      icon: 'FileCheck'
    }
  ];

  const shareOptions_list = [
    {
      method: 'email',
      name: currentLanguage === 'fa' ? 'ایمیل' : 'Email',
      description: currentLanguage === 'fa' ? 'ارسال به پزشک معالج' : 'Send to healthcare provider',
      icon: 'Mail'
    },
    {
      method: 'print',
      name: currentLanguage === 'fa' ? 'چاپ' : 'Print',
      description: currentLanguage === 'fa' ? 'چاپ گزارش' : 'Print report',
      icon: 'Printer'
    },
    {
      method: 'link',
      name: currentLanguage === 'fa' ? 'لینک اشتراک' : 'Share Link',
      description: currentLanguage === 'fa' ? 'ایجاد لینک امن' : 'Generate secure link',
      icon: 'Link'
    }
  ];

  return (
    <div className={`card-clinical-elevated p-6 ${className}`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground font-heading">
            {currentLanguage === 'fa' ? 'اقدامات' : 'Actions'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentLanguage === 'fa' ? 'مدیریت نتایج و برنامه‌ریزی' : 'Manage results and planning'}
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Primary Actions */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            {currentLanguage === 'fa' ? 'اقدامات اصلی' : 'Primary Actions'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => handleDownloadReport('pdf')}
              loading={isGeneratingReport}
              iconName="Download"
              iconPosition="left"
              className="justify-start h-auto p-4"
            >
              <div className="text-left rtl:text-right">
                <div className="font-medium">
                  {currentLanguage === 'fa' ? 'دانلود گزارش' : 'Download Report'}
                </div>
                <div className="text-xs opacity-80">
                  {currentLanguage === 'fa' ? 'گزارش کامل PDF' : 'Complete PDF report'}
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShareOptions(!shareOptions)}
              iconName="Share"
              iconPosition="left"
              className="justify-start h-auto p-4"
            >
              <div className="text-left rtl:text-right">
                <div className="font-medium">
                  {currentLanguage === 'fa' ? 'اشتراک‌گذاری' : 'Share Results'}
                </div>
                <div className="text-xs opacity-80">
                  {currentLanguage === 'fa' ? 'با پزشک معالج' : 'With healthcare provider'}
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Share Options Dropdown */}
        {shareOptions && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border animate-fade-in">
            <h4 className="text-sm font-medium text-foreground mb-3">
              {currentLanguage === 'fa' ? 'روش‌های اشتراک‌گذاری' : 'Sharing Options'}
            </h4>
            <div className="space-y-2">
              {shareOptions_list?.map((option) => (
                <button
                  key={option?.method}
                  onClick={() => handleShare(option?.method)}
                  className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-muted/50 transition-clinical text-left rtl:text-right"
                >
                  <Icon name={option?.icon} size={18} className="text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {option?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {option?.description}
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground rtl:rotate-180" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Report Formats */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            {currentLanguage === 'fa' ? 'فرمت‌های گزارش' : 'Report Formats'}
          </h3>
          <div className="space-y-2">
            {reportFormats?.map((format) => (
              <button
                key={format?.format}
                onClick={() => handleDownloadReport(format?.format)}
                disabled={isGeneratingReport}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-muted/30 transition-clinical text-left rtl:text-right disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name={format?.icon} size={18} className="text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {format?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format?.description}
                  </div>
                </div>
                <Icon name="Download" size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Follow-up Actions */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            {currentLanguage === 'fa' ? 'پیگیری' : 'Follow-up'}
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Icon name="Calendar" size={18} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-primary mb-1">
                    {currentLanguage === 'fa' ? 'ارزیابی بعدی' : 'Next Assessment'}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {currentLanguage === 'fa' 
                      ? `تاریخ پیشنهادی: ${nextAssessmentDate?.toLocaleDateString('fa-IR')}`
                      : `Recommended date: ${nextAssessmentDate?.toLocaleDateString()}`
                    }
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onScheduleFollowup}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'برنامه‌ریزی' : 'Schedule'}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="default"
              onClick={onStartNewAssessment}
              iconName="RefreshCw"
              iconPosition="left"
              className="w-full"
            >
              {currentLanguage === 'fa' ? 'شروع ارزیابی جدید' : 'Start New Assessment'}
            </Button>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="p-4 bg-therapeutic-green/5 rounded-lg border border-therapeutic-green/10">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Icon name="Stethoscope" size={18} className="text-therapeutic-green mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-therapeutic-green mb-2">
                {currentLanguage === 'fa' ? 'توصیه‌های کلینیکی' : 'Clinical Recommendations'}
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  {currentLanguage === 'fa' ?'• مراجعه به متخصص ارتوپدی در اولویت' :'• Orthopedic specialist consultation priority'
                  }
                </li>
                <li>
                  {currentLanguage === 'fa' ?'• شروع برنامه فیزیوتراپی تخصصی' :'• Initiate specialized physiotherapy program'
                  }
                </li>
                <li>
                  {currentLanguage === 'fa' ?'• پیگیری ماهانه وضعیت درد' :'• Monthly pain status monitoring'
                  }
                </li>
                <li>
                  {currentLanguage === 'fa' ?'• ارزیابی مجدد پس از ۳ ماه' :'• Re-assessment after 3 months'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-4 bg-error/5 rounded-lg border border-error/10">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Icon name="AlertTriangle" size={18} className="text-error mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-error mb-2">
                {currentLanguage === 'fa' ? 'تماس اضطراری' : 'Emergency Contact'}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {currentLanguage === 'fa' ?'در صورت تشدید درد یا بروز علائم جدید:' :'In case of worsening pain or new symptoms:'
                }
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  iconPosition="left"
                >
                  {currentLanguage === 'fa' ? 'تماس فوری' : 'Emergency Call'}
                </Button>
                <span className="text-xs font-data text-muted-foreground">
                  {currentLanguage === 'fa' ? '۰۲۱-۱۲۳۴۵۶۷۸' : '+98-21-12345678'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {currentLanguage === 'fa' 
              ? `آخرین ارزیابی: ${new Date()?.toLocaleDateString('fa-IR')}`
              : `Last assessment: ${new Date()?.toLocaleDateString()}`
            }
          </span>
          <span>
            {currentLanguage === 'fa' ? 'شناسه بیمار: P-2024-001' : 'Patient ID: P-2024-001'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;