import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const MedicalHistorySection = ({ 
  formData, 
  onInputChange, 
  onCheckboxChange,
  errors = {},
  className = '' 
}) => {
  const currentLanguage = useLanguage();

  const painDurationOptions = [
    { 
      value: 'less_than_week', 
      label: currentLanguage === 'fa' ? 'کمتر از یک هفته' : 'Less than a week' 
    },
    { 
      value: 'one_to_four_weeks', 
      label: currentLanguage === 'fa' ? '۱ تا ۴ هفته' : '1-4 weeks' 
    },
    { 
      value: 'one_to_three_months', 
      label: currentLanguage === 'fa' ? '۱ تا ۳ ماه' : '1-3 months' 
    },
    { 
      value: 'three_to_six_months', 
      label: currentLanguage === 'fa' ? '۳ تا ۶ ماه' : '3-6 months' 
    },
    { 
      value: 'more_than_six_months', 
      label: currentLanguage === 'fa' ? 'بیش از ۶ ماه' : 'More than 6 months' 
    }
  ];

  const painIntensityOptions = [
    { value: '1', label: currentLanguage === 'fa' ? '۱ - خیلی کم' : '1 - Very Mild' },
    { value: '2', label: currentLanguage === 'fa' ? '۲ - کم' : '2 - Mild' },
    { value: '3', label: currentLanguage === 'fa' ? '۳ - متوسط' : '3 - Moderate' },
    { value: '4', label: currentLanguage === 'fa' ? '۴ - شدید' : '4 - Severe' },
    { value: '5', label: currentLanguage === 'fa' ? '۵ - خیلی شدید' : '5 - Very Severe' }
  ];

  const medicalConditions = [
    { 
      key: 'diabetes', 
      label: currentLanguage === 'fa' ? 'دیابت' : 'Diabetes' 
    },
    { 
      key: 'hypertension', 
      label: currentLanguage === 'fa' ? 'فشار خون بالا' : 'Hypertension' 
    },
    { 
      key: 'arthritis', 
      label: currentLanguage === 'fa' ? 'آرتریت' : 'Arthritis' 
    },
    { 
      key: 'osteoporosis', 
      label: currentLanguage === 'fa' ? 'پوکی استخوان' : 'Osteoporosis' 
    },
    { 
      key: 'depression', 
      label: currentLanguage === 'fa' ? 'افسردگی' : 'Depression' 
    },
    { 
      key: 'anxiety', 
      label: currentLanguage === 'fa' ? 'اضطراب' : 'Anxiety' 
    }
  ];

  const previousTreatments = [
    { 
      key: 'physiotherapy', 
      label: currentLanguage === 'fa' ? 'فیزیوتراپی' : 'Physiotherapy' 
    },
    { 
      key: 'medication', 
      label: currentLanguage === 'fa' ? 'دارودرمانی' : 'Medication' 
    },
    { 
      key: 'surgery', 
      label: currentLanguage === 'fa' ? 'جراحی' : 'Surgery' 
    },
    { 
      key: 'injection', 
      label: currentLanguage === 'fa' ? 'تزریق' : 'Injection' 
    },
    { 
      key: 'chiropractic', 
      label: currentLanguage === 'fa' ? 'کایروپرکتیک' : 'Chiropractic' 
    },
    { 
      key: 'acupuncture', 
      label: currentLanguage === 'fa' ? 'طب سوزنی' : 'Acupuncture' 
    }
  ];

  return (
    <div className={`questionnaire-section ${className}`}>
      <div className="questionnaire-header">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'سابقه پزشکی' : 'Medical History'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentLanguage === 'fa' ?'اطلاعات مربوط به سابقه پزشکی و درد کمر خود را وارد کنید' :'Please provide information about your medical history and back pain'
          }
        </p>
      </div>
      <div className="space-clinical">
        <div className="grid-clinical-2">
          <Select
            label={currentLanguage === 'fa' ? 'مدت زمان درد کمر' : 'Duration of Back Pain'}
            name="painDuration"
            options={painDurationOptions}
            value={formData?.painDuration || ''}
            onChange={(value) => onInputChange({ target: { name: 'painDuration', value } })}
            placeholder={currentLanguage === 'fa' ? 'مدت زمان درد را انتخاب کنید' : 'Select pain duration'}
            error={errors?.painDuration}
            required
          />

          <Select
            label={currentLanguage === 'fa' ? 'شدت درد فعلی (۱-۵)' : 'Current Pain Intensity (1-5)'}
            name="painIntensity"
            options={painIntensityOptions}
            value={formData?.painIntensity || ''}
            onChange={(value) => onInputChange({ target: { name: 'painIntensity', value } })}
            placeholder={currentLanguage === 'fa' ? 'شدت درد را انتخاب کنید' : 'Select pain intensity'}
            error={errors?.painIntensity}
            required
          />
        </div>

        <Input
          label={currentLanguage === 'fa' ? 'توضیح درد' : 'Pain Description'}
          type="text"
          name="painDescription"
          value={formData?.painDescription || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? 'درد خود را توضیح دهید (مثل: سوزشی، کشیدگی، ضربان‌دار)' : 'Describe your pain (e.g., burning, pulling, throbbing)'}
          error={errors?.painDescription}
        />

        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            {currentLanguage === 'fa' ? 'بیماری‌های همراه' : 'Medical Conditions'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {medicalConditions?.map((condition) => (
              <Checkbox
                key={condition?.key}
                label={condition?.label}
                checked={formData?.medicalConditions?.[condition?.key] || false}
                onChange={(e) => onCheckboxChange('medicalConditions', condition?.key, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            {currentLanguage === 'fa' ? 'درمان‌های قبلی' : 'Previous Treatments'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {previousTreatments?.map((treatment) => (
              <Checkbox
                key={treatment?.key}
                label={treatment?.label}
                checked={formData?.previousTreatments?.[treatment?.key] || false}
                onChange={(e) => onCheckboxChange('previousTreatments', treatment?.key, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        <Input
          label={currentLanguage === 'fa' ? 'داروهای فعلی' : 'Current Medications'}
          type="text"
          name="currentMedications"
          value={formData?.currentMedications || ''}
          onChange={onInputChange}
          placeholder={currentLanguage === 'fa' ? 'داروهایی که در حال حاضر مصرف می‌کنید را ذکر کنید' : 'List medications you are currently taking'}
          error={errors?.currentMedications}
        />

        <div className="grid-clinical-2">
          <Input
            label={currentLanguage === 'fa' ? 'قد (سانتی‌متر)' : 'Height (cm)'}
            type="number"
            name="height"
            value={formData?.height || ''}
            onChange={onInputChange}
            placeholder={currentLanguage === 'fa' ? '۱۷۵' : '175'}
            error={errors?.height}
            min="100"
            max="250"
            required
          />

          <Input
            label={currentLanguage === 'fa' ? 'وزن (کیلوگرم)' : 'Weight (kg)'}
            type="number"
            name="weight"
            value={formData?.weight || ''}
            onChange={onInputChange}
            placeholder={currentLanguage === 'fa' ? '۷۰' : '70'}
            error={errors?.weight}
            min="30"
            max="200"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalHistorySection;