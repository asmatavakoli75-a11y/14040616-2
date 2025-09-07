import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const AccessibilityInfo = () => {
  const currentLanguage = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const accessibilityFeatures = [
    {
      icon: 'Eye',
      title: currentLanguage === 'fa' ? 'کنتراست بالا' : 'High Contrast',
      description: currentLanguage === 'fa' ?'رنگ‌های با کنتراست بالا برای خوانایی بهتر' :'High contrast colors for better readability'
    },
    {
      icon: 'Volume2',
      title: currentLanguage === 'fa' ? 'صفحه‌خوان' : 'Screen Reader',
      description: currentLanguage === 'fa' ?'سازگار با نرم‌افزارهای صفحه‌خوان' :'Compatible with screen reader software'
    },
    {
      icon: 'Type',
      title: currentLanguage === 'fa' ? 'فونت مناسب' : 'Readable Fonts',
      description: currentLanguage === 'fa' ?'فونت وزیرمتن برای خوانایی بهتر فارسی' :'Vazirmatn font for better Farsi readability'
    },
    {
      icon: 'Navigation',
      title: currentLanguage === 'fa' ? 'ناوبری کیبورد' : 'Keyboard Navigation',
      description: currentLanguage === 'fa' ?'امکان استفاده کامل با کیبورد' :'Full keyboard navigation support'
    }
  ];

  const keyboardShortcuts = [
    { key: 'Tab', action: currentLanguage === 'fa' ? 'حرکت بین فیلدها' : 'Navigate between fields' },
    { key: 'Enter', action: currentLanguage === 'fa' ? 'ورود' : 'Submit login' },
    { key: 'Alt + L', action: currentLanguage === 'fa' ? 'تغییر زبان' : 'Toggle language' },
    { key: 'Esc', action: currentLanguage === 'fa' ? 'لغو عملیات' : 'Cancel operation' }
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="card-clinical">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-left rtl:text-right hover:bg-muted/50 transition-clinical focus-clinical rounded-lg"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Icon name="Accessibility" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'ویژگی‌های دسترسی' : 'Accessibility Features'}
            </span>
          </div>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground transition-clinical"
          />
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-6 animate-fade-in">
            {/* Accessibility Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">
                {currentLanguage === 'fa' ? 'ویژگی‌های پشتیبانی' : 'Support Features'}
              </h4>
              <div className="space-y-3">
                {accessibilityFeatures?.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center flex-shrink-0">
                      <Icon name={feature?.icon} size={12} className="text-success" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-medium text-foreground mb-1">
                        {feature?.title}
                      </h5>
                      <p className="text-xs text-muted-foreground font-caption">
                        {feature?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground">
                {currentLanguage === 'fa' ? 'کلیدهای میانبر' : 'Keyboard Shortcuts'}
              </h4>
              <div className="space-y-2">
                {keyboardShortcuts?.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {shortcut?.action}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-data bg-muted border border-border rounded">
                      {shortcut?.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* WCAG Compliance */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-xs font-medium text-success">
                  {currentLanguage === 'fa' ? 'مطابق با استاندارد WCAG AA' : 'WCAG AA Compliant'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-caption">
                {currentLanguage === 'fa' ?'این سیستم با استانداردهای دسترسی وب مطابقت دارد' :'This system meets web accessibility standards'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityInfo;