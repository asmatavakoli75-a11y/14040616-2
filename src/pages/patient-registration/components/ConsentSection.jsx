import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useLanguage } from '../../../components/ui/LanguageToggle';
import Icon from '../../../components/AppIcon';

const ConsentSection = ({ 
  formData, 
  onCheckboxChange, 
  errors = {},
  className = '' 
}) => {
  const currentLanguage = useLanguage();

  const consentItems = [
    {
      key: 'dataProcessing',
      title: currentLanguage === 'fa' ? 'رضایت پردازش داده‌ها' : 'Data Processing Consent',
      description: currentLanguage === 'fa' ?'من با پردازش اطلاعات شخصی و پزشکی خود برای اهداف تشخیصی و درمانی موافقم.' :'I consent to the processing of my personal and medical information for diagnostic and treatment purposes.',
      required: true
    },
    {
      key: 'dataSharing',
      title: currentLanguage === 'fa' ? 'اشتراک‌گذاری داده‌ها' : 'Data Sharing',
      description: currentLanguage === 'fa' ?'من با اشتراک‌گذاری داده‌های غیرشخصی خود برای تحقیقات علمی موافقم.' :'I consent to sharing my anonymized data for scientific research purposes.',
      required: false
    },
    {
      key: 'communication',
      title: currentLanguage === 'fa' ? 'ارتباطات' : 'Communications',
      description: currentLanguage === 'fa' ?'من با دریافت یادآوری‌ها و اطلاعات مربوط به درمان از طریق ایمیل یا پیامک موافقم.' :'I consent to receiving treatment reminders and information via email or SMS.',
      required: false
    },
    {
      key: 'termsConditions',
      title: currentLanguage === 'fa' ? 'شرایط و قوانین' : 'Terms and Conditions',
      description: currentLanguage === 'fa' ?'من شرایط و قوانین استفاده از سیستم را خوانده و با آن‌ها موافقم.' :'I have read and agree to the terms and conditions of using this system.',
      required: true
    }
  ];

  return (
    <div className={`questionnaire-section ${className}`}>
      <div className="questionnaire-header">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'رضایت‌نامه و موافقت‌ها' : 'Consent and Agreements'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ?'لطفاً موارد زیر را مطالعه کرده و موافقت خود را اعلام کنید' :'Please review the following items and provide your consent'
              }
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {consentItems?.map((item) => (
          <div key={item?.key} className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  checked={formData?.consents?.[item?.key] || false}
                  onChange={(e) => onCheckboxChange('consents', item?.key, e?.target?.checked)}
                  required={item?.required}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {item?.title}
                  </h4>
                  {item?.required && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-error/10 text-error">
                      {currentLanguage === 'fa' ? 'الزامی' : 'Required'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item?.description}
                </p>
              </div>
            </div>
            {errors?.consents?.[item?.key] && (
              <div className="mt-2 text-sm text-error">
                {errors?.consents?.[item?.key]}
              </div>
            )}
          </div>
        ))}

        {/* Privacy Notice */}
        <div className="p-4 bg-therapeutic-green/10 rounded-lg border border-therapeutic-green/20">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Icon name="Info" size={16} className="text-therapeutic-green mt-0.5 flex-shrink-0" />
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">
                {currentLanguage === 'fa' ? 'حریم خصوصی شما مهم است' : 'Your Privacy Matters'}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {currentLanguage === 'fa' ?'تمام اطلاعات شما با استانداردهای بین‌المللی حفاظت داده‌ها محافظت می‌شود و هیچ‌گاه بدون اجازه شما به اشتراک گذاشته نخواهد شد.' :'All your information is protected according to international data protection standards and will never be shared without your explicit permission.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            {currentLanguage === 'fa' ? 'سوالات یا نگرانی‌ها؟' : 'Questions or Concerns?'}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {currentLanguage === 'fa' ?'در صورت داشتن سوال در مورد حریم خصوصی یا استفاده از داده‌ها، با ما تماس بگیرید:' :'If you have questions about privacy or data usage, please contact us:'
            }
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 rtl:sm:space-x-reverse space-y-2 sm:space-y-0 text-sm">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="Mail" size={14} className="text-muted-foreground" />
              <span className="text-foreground">privacy@clbp-system.com</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="Phone" size={14} className="text-muted-foreground" />
              <span className="text-foreground">
                {currentLanguage === 'fa' ? '۰۲۱-۱۲۳۴۵۶۷۸' : '021-12345678'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentSection;