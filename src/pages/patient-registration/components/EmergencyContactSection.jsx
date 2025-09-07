import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const EmergencyContactSection = ({ 
  formData, 
  onInputChange, 
  errors = {},
  className = '' 
}) => {
  const currentLanguage = useLanguage();

  const relationshipOptions = [
    { 
      value: 'spouse', 
      label: currentLanguage === 'fa' ? 'همسر' : 'Spouse' 
    },
    { 
      value: 'parent', 
      label: currentLanguage === 'fa' ? 'والدین' : 'Parent' 
    },
    { 
      value: 'child', 
      label: currentLanguage === 'fa' ? 'فرزند' : 'Child' 
    },
    { 
      value: 'sibling', 
      label: currentLanguage === 'fa' ? 'خواهر/برادر' : 'Sibling' 
    },
    { 
      value: 'friend', 
      label: currentLanguage === 'fa' ? 'دوست' : 'Friend' 
    },
    { 
      value: 'colleague', 
      label: currentLanguage === 'fa' ? 'همکار' : 'Colleague' 
    },
    { 
      value: 'other', 
      label: currentLanguage === 'fa' ? 'سایر' : 'Other' 
    }
  ];

  return (
    <div className={`questionnaire-section ${className}`}>
      <div className="questionnaire-header">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'اطلاعات تماس اضطراری' : 'Emergency Contact Information'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentLanguage === 'fa' ?'اطلاعات شخصی که در مواقع اضطراری با او تماس گرفته شود' :'Information of person to contact in case of emergency'
          }
        </p>
      </div>
      <div className="grid-clinical-2">
        <Input
          label={currentLanguage === 'fa' ? 'نام کامل' : 'Full Name'}
          type="text"
          name="emergencyContactName"
          value={formData?.emergencyContactName || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? 'نام کامل فرد تماس اضطراری' : 'Full name of emergency contact'}
          error={errors?.emergencyContactName}
          required
        />

        <Select
          label={currentLanguage === 'fa' ? 'نسبت' : 'Relationship'}
          name="emergencyContactRelationship"
          options={relationshipOptions}
          value={formData?.emergencyContactRelationship || ''}
          onChange={(value) => onInputChange({ target: { name: 'emergencyContactRelationship', value } })}
          placeholder={currentLanguage === 'fa' ? 'نسبت با شما' : 'Relationship to you'}
          error={errors?.emergencyContactRelationship}
          required
        />

        <Input
          label={currentLanguage === 'fa' ? 'شماره تماس اول' : 'Primary Phone'}
          type="tel"
          name="emergencyContactPhone1"
          value={formData?.emergencyContactPhone1 || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? '۰۹۱۲۳۴۵۶۷۸۹' : '09123456789'}
          error={errors?.emergencyContactPhone1}
          required
        />

        <Input
          label={currentLanguage === 'fa' ? 'شماره تماس دوم (اختیاری)' : 'Secondary Phone (Optional)'}
          type="tel"
          name="emergencyContactPhone2"
          value={formData?.emergencyContactPhone2 || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? '۰۲۱۱۲۳۴۵۶۷۸' : '02112345678'}
          error={errors?.emergencyContactPhone2}
        />
      </div>
      <Input
        label={currentLanguage === 'fa' ? 'آدرس (اختیاری)' : 'Address (Optional)'}
        type="text"
        name="emergencyContactAddress"
        value={formData?.emergencyContactAddress || ''}
        onChange={onInputChange}
        placeholder={currentLanguage === 'fa' ? 'آدرس فرد تماس اضطراری' : 'Emergency contact address'}
        error={errors?.emergencyContactAddress}
      />
    </div>
  );
};

export default EmergencyContactSection;