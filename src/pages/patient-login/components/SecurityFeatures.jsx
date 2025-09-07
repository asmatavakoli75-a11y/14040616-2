import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const SecurityFeatures = () => {
  const currentLanguage = useLanguage();

  const securityFeatures = [
    {
      icon: 'Shield',
      title: currentLanguage === 'fa' ? 'امنیت JWT' : 'JWT Security',
      description: currentLanguage === 'fa' ?'احراز هویت امن با رمزنگاری پیشرفته' :'Secure authentication with advanced encryption'
    },
    {
      icon: 'Lock',
      title: currentLanguage === 'fa' ? 'حفاظت از داده‌ها' : 'Data Protection',
      description: currentLanguage === 'fa' ?'اطلاعات پزشکی شما کاملاً محفوظ است' :'Your medical information is fully protected'
    },
    {
      icon: 'Eye',
      title: currentLanguage === 'fa' ? 'کنترل دسترسی' : 'Access Control',
      description: currentLanguage === 'fa' ?'دسترسی محدود به اطلاعات شخصی' :'Restricted access to personal information'
    },
    {
      icon: 'Clock',
      title: currentLanguage === 'fa' ? 'نشست امن' : 'Secure Session',
      description: currentLanguage === 'fa' ?'خروج خودکار پس از عدم فعالیت' :'Automatic logout after inactivity'
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="card-clinical p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="ShieldCheck" size={24} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-heading mb-2">
            {currentLanguage === 'fa' ? 'امنیت پیشرفته' : 'Advanced Security'}
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            {currentLanguage === 'fa' ?'اطلاعات پزشکی شما با بالاترین استانداردهای امنیتی محافظت می‌شود' :'Your medical data is protected with the highest security standards'
            }
          </p>
        </div>

        <div className="space-y-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {feature?.title}
                </h4>
                <p className="text-xs text-muted-foreground font-caption">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Badges */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="Award" size={16} className="text-success" />
              <span className="text-xs font-medium text-success">
                {currentLanguage === 'fa' ? 'HIPAA' : 'HIPAA'}
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-xs font-medium text-success">
                {currentLanguage === 'fa' ? 'ISO 27001' : 'ISO 27001'}
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-xs font-medium text-success">
                {currentLanguage === 'fa' ? 'GDPR' : 'GDPR'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;