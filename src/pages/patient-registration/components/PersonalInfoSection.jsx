import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const PersonalInfoSection = ({ 
  formData, 
  onInputChange, 
  errors = {},
  className = '' 
}) => {
  const currentLanguage = useLanguage();

  const genderOptions = [
    { 
      value: 'male', 
      label: currentLanguage === 'fa' ? 'مرد' : 'Male' 
    },
    { 
      value: 'female', 
      label: currentLanguage === 'fa' ? 'زن' : 'Female' 
    },
    { 
      value: 'other', 
      label: currentLanguage === 'fa' ? 'سایر' : 'Other' 
    }
  ];

  const educationOptions = [
    { 
      value: 'primary', 
      label: currentLanguage === 'fa' ? 'ابتدایی' : 'Primary School' 
    },
    { 
      value: 'secondary', 
      label: currentLanguage === 'fa' ? 'متوسطه' : 'Secondary School' 
    },
    { 
      value: 'diploma', 
      label: currentLanguage === 'fa' ? 'دیپلم' : 'High School Diploma' 
    },
    { 
      value: 'bachelor', 
      label: currentLanguage === 'fa' ? 'کارشناسی' : 'Bachelor\'s Degree' 
    },
    { 
      value: 'master', 
      label: currentLanguage === 'fa' ? 'کارشناسی ارشد' : 'Master\'s Degree' 
    },
    { 
      value: 'doctorate', 
      label: currentLanguage === 'fa' ? 'دکترا' : 'Doctorate' 
    }
  ];

  const occupationOptions = [
    { 
      value: 'military', 
      label: currentLanguage === 'fa' ? 'نظامی' : 'Military Personnel' 
    },
    { 
      value: 'office', 
      label: currentLanguage === 'fa' ? 'کارمند اداری' : 'Office Worker' 
    },
    { 
      value: 'manual', 
      label: currentLanguage === 'fa' ? 'کار فیزیکی' : 'Manual Labor' 
    },
    { 
      value: 'healthcare', 
      label: currentLanguage === 'fa' ? 'پزشکی' : 'Healthcare' 
    },
    { 
      value: 'education', 
      label: currentLanguage === 'fa' ? 'آموزش' : 'Education' 
    },
    { 
      value: 'retired', 
      label: currentLanguage === 'fa' ? 'بازنشسته' : 'Retired' 
    },
    { 
      value: 'student', 
      label: currentLanguage === 'fa' ? 'دانشجو' : 'Student' 
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
          {currentLanguage === 'fa' ? 'اطلاعات شخصی' : 'Personal Information'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentLanguage === 'fa' ?'لطفاً اطلاعات شخصی خود را وارد کنید' :'Please enter your personal information'
          }
        </p>
      </div>
      <div className="grid-clinical-2">
        <Input
          label={currentLanguage === 'fa' ? 'نام' : 'First Name'}
          type="text"
          name="firstName"
          value={formData?.firstName || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? 'نام خود را وارد کنید' : 'Enter your first name'}
          error={errors?.firstName}
          required
        />

        <Input
          label={currentLanguage === 'fa' ? 'نام خانوادگی' : 'Last Name'}
          type="text"
          name="lastName"
          value={formData?.lastName || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? 'نام خانوادگی خود را وارد کنید' : 'Enter your last name'}
          error={errors?.lastName}
          required
        />

        <Input
          label={currentLanguage === 'fa' ? 'کد ملی' : 'National ID'}
          type="text"
          name="nationalId"
          value={formData?.nationalId || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? '۱۲۳۴۵۶۷۸۹۰' : '1234567890'}
          error={errors?.nationalId}
          required
          maxLength={10}
        />

        <Input
          label={currentLanguage === 'fa' ? 'تاریخ تولد' : 'Date of Birth'}
          type="date"
          name="dateOfBirth"
          value={formData?.dateOfBirth || ''}
          onChange={onInputChange}
          error={errors?.dateOfBirth}
          required
          max={new Date()?.toISOString()?.split('T')?.[0]}
        />

        <Select
          label={currentLanguage === 'fa' ? 'جنسیت' : 'Gender'}
          name="gender"
          options={genderOptions}
          value={formData?.gender || ''}
          onChange={(value) => onInputChange({ target: { name: 'gender', value } })}
          placeholder={currentLanguage === 'fa' ? 'جنسیت خود را انتخاب کنید' : 'Select your gender'}
          error={errors?.gender}
          required
        />

        <Input
          label={currentLanguage === 'fa' ? 'شماره تماس' : 'Phone Number'}
          type="tel"
          name="phoneNumber"
          value={formData?.phoneNumber || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? '۰۹۱۲۳۴۵۶۷۸۹' : '09123456789'}
          error={errors?.phoneNumber}
          required
        />

        <Input
          label={currentLanguage === 'fa' ? 'ایمیل' : 'Email Address'}
          type="email"
          name="email"
          value={formData?.email || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? 'example@email.com' : 'example@email.com'}
          error={errors?.email}
          required
        />

        <Select
          label={currentLanguage === 'fa' ? 'سطح تحصیلات' : 'Education Level'}
          name="education"
          options={educationOptions}
          value={formData?.education || ''}
          onChange={(value) => onInputChange({ target: { name: 'education', value } })}
          placeholder={currentLanguage === 'fa' ? 'سطح تحصیلات خود را انتخاب کنید' : 'Select your education level'}
          error={errors?.education}
          required
        />

        <Select
          label={currentLanguage === 'fa' ? 'شغل' : 'Occupation'}
          name="occupation"
          options={occupationOptions}
          value={formData?.occupation || ''}
          onChange={(value) => onInputChange({ target: { name: 'occupation', value } })}
          placeholder={currentLanguage === 'fa' ? 'شغل خود را انتخاب کنید' : 'Select your occupation'}
          error={errors?.occupation}
          required
        />
      </div>
      <Input
        label={currentLanguage === 'fa' ? 'آدرس' : 'Address'}
        type="text"
        name="address"
        value={formData?.address || ''}
        onChange={onInputChange}
        placeholder={currentLanguage === 'fa' ? 'آدرس کامل خود را وارد کنید' : 'Enter your complete address'}
        error={errors?.address}
        required
      />
    </div>
  );
};

export default PersonalInfoSection;