import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LanguageToggle, { useLanguage } from '../../components/ui/LanguageToggle';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PersonalInfoSection from './components/PersonalInfoSection';
import MedicalHistorySection from './components/MedicalHistorySection';
import EmergencyContactSection from './components/EmergencyContactSection';
import ConsentSection from './components/ConsentSection';
import RegistrationProgress from './components/RegistrationProgress';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const currentLanguage = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [completedSections, setCompletedSections] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    education: '',
    occupation: '',
    address: '',
    
    // Medical History
    painDuration: '',
    painIntensity: '',
    painDescription: '',
    medicalConditions: {},
    previousTreatments: {},
    currentMedications: '',
    height: '',
    weight: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone1: '',
    emergencyContactPhone2: '',
    emergencyContactAddress: '',
    
    // Consents
    consents: {}
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('patientRegistrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        
        // Calculate completed sections based on saved data
        const completed = [];
        if (validatePersonalInfo(parsedData, false)) completed?.push(1);
        if (validateMedicalHistory(parsedData, false)) completed?.push(2);
        if (validateEmergencyContact(parsedData, false)) completed?.push(3);
        if (validateConsents(parsedData, false)) completed?.push(4);
        
        setCompletedSections(completed);
      } catch (error) {
        console.error('Error loading saved registration data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('patientRegistrationData', JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle checkbox changes for nested objects
  const handleCheckboxChange = (section, key, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [key]: checked
      }
    }));
  };

  // Validation functions
  const validatePersonalInfo = (data, showErrors = true) => {
    const newErrors = {};
    
    if (!data?.firstName?.trim()) {
      newErrors.firstName = currentLanguage === 'fa' ? 'نام الزامی است' : 'First name is required';
    }
    
    if (!data?.lastName?.trim()) {
      newErrors.lastName = currentLanguage === 'fa' ? 'نام خانوادگی الزامی است' : 'Last name is required';
    }
    
    if (!data?.nationalId?.trim()) {
      newErrors.nationalId = currentLanguage === 'fa' ? 'کد ملی الزامی است' : 'National ID is required';
    } else if (!/^\d{10}$/?.test(data?.nationalId)) {
      newErrors.nationalId = currentLanguage === 'fa' ? 'کد ملی باید ۱۰ رقم باشد' : 'National ID must be 10 digits';
    }
    
    if (!data?.dateOfBirth) {
      newErrors.dateOfBirth = currentLanguage === 'fa' ? 'تاریخ تولد الزامی است' : 'Date of birth is required';
    }
    
    if (!data?.gender) {
      newErrors.gender = currentLanguage === 'fa' ? 'جنسیت الزامی است' : 'Gender is required';
    }
    
    if (!data?.phoneNumber?.trim()) {
      newErrors.phoneNumber = currentLanguage === 'fa' ? 'شماره تماس الزامی است' : 'Phone number is required';
    } else if (!/^09\d{9}$/?.test(data?.phoneNumber)) {
      newErrors.phoneNumber = currentLanguage === 'fa' ? 'شماره تماس معتبر نیست' : 'Invalid phone number format';
    }
    
    if (!data?.email?.trim()) {
      newErrors.email = currentLanguage === 'fa' ? 'ایمیل الزامی است' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(data?.email)) {
      newErrors.email = currentLanguage === 'fa' ? 'فرمت ایمیل معتبر نیست' : 'Invalid email format';
    }
    
    if (!data?.education) {
      newErrors.education = currentLanguage === 'fa' ? 'سطح تحصیلات الزامی است' : 'Education level is required';
    }
    
    if (!data?.occupation) {
      newErrors.occupation = currentLanguage === 'fa' ? 'شغل الزامی است' : 'Occupation is required';
    }
    
    if (!data?.address?.trim()) {
      newErrors.address = currentLanguage === 'fa' ? 'آدرس الزامی است' : 'Address is required';
    }
    
    if (showErrors) {
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
    
    return Object.keys(newErrors)?.length === 0;
  };

  const validateMedicalHistory = (data, showErrors = true) => {
    const newErrors = {};
    
    if (!data?.painDuration) {
      newErrors.painDuration = currentLanguage === 'fa' ? 'مدت زمان درد الزامی است' : 'Pain duration is required';
    }
    
    if (!data?.painIntensity) {
      newErrors.painIntensity = currentLanguage === 'fa' ? 'شدت درد الزامی است' : 'Pain intensity is required';
    }
    
    if (!data?.height || data?.height < 100 || data?.height > 250) {
      newErrors.height = currentLanguage === 'fa' ? 'قد معتبر وارد کنید (۱۰۰-۲۵۰ سانتی‌متر)' : 'Enter valid height (100-250 cm)';
    }
    
    if (!data?.weight || data?.weight < 30 || data?.weight > 200) {
      newErrors.weight = currentLanguage === 'fa' ? 'وزن معتبر وارد کنید (۳۰-۲۰۰ کیلوگرم)' : 'Enter valid weight (30-200 kg)';
    }
    
    if (showErrors) {
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
    
    return Object.keys(newErrors)?.length === 0;
  };

  const validateEmergencyContact = (data, showErrors = true) => {
    const newErrors = {};
    
    if (!data?.emergencyContactName?.trim()) {
      newErrors.emergencyContactName = currentLanguage === 'fa' ? 'نام فرد تماس اضطراری الزامی است' : 'Emergency contact name is required';
    }
    
    if (!data?.emergencyContactRelationship) {
      newErrors.emergencyContactRelationship = currentLanguage === 'fa' ? 'نسبت الزامی است' : 'Relationship is required';
    }
    
    if (!data?.emergencyContactPhone1?.trim()) {
      newErrors.emergencyContactPhone1 = currentLanguage === 'fa' ? 'شماره تماس اول الزامی است' : 'Primary phone is required';
    } else if (!/^09\d{9}$/?.test(data?.emergencyContactPhone1)) {
      newErrors.emergencyContactPhone1 = currentLanguage === 'fa' ? 'شماره تماس معتبر نیست' : 'Invalid phone number format';
    }
    
    if (showErrors) {
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
    
    return Object.keys(newErrors)?.length === 0;
  };

  const validateConsents = (data, showErrors = true) => {
    const newErrors = { consents: {} };
    
    const requiredConsents = ['dataProcessing', 'termsConditions'];
    
    requiredConsents?.forEach(consent => {
      if (!data?.consents?.[consent]) {
        newErrors.consents[consent] = currentLanguage === 'fa' ? 'این موافقت الزامی است' : 'This consent is required';
      }
    });
    
    if (showErrors && Object.keys(newErrors?.consents)?.length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
    
    return Object.keys(newErrors?.consents)?.length === 0;
  };

  // Handle section validation and navigation
  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validatePersonalInfo(formData);
        break;
      case 2:
        isValid = validateMedicalHistory(formData);
        break;
      case 3:
        isValid = validateEmergencyContact(formData);
        break;
      case 4:
        isValid = validateConsents(formData);
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      // Add current step to completed sections
      if (!completedSections?.includes(currentStep)) {
        setCompletedSections(prev => [...prev, currentStep]);
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all sections
    const isPersonalValid = validatePersonalInfo(formData);
    const isMedicalValid = validateMedicalHistory(formData);
    const isEmergencyValid = validateEmergencyContact(formData);
    const isConsentsValid = validateConsents(formData);
    
    if (!isPersonalValid || !isMedicalValid || !isEmergencyValid || !isConsentsValid) {
      // Find first invalid section and navigate to it
      if (!isPersonalValid) setCurrentStep(1);
      else if (!isMedicalValid) setCurrentStep(2);
      else if (!isEmergencyValid) setCurrentStep(3);
      else if (!isConsentsValid) setCurrentStep(4);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved data
      localStorage.removeItem('patientRegistrationData');
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Navigate to login page after delay
      setTimeout(() => {
        navigate('/patient-login', {
          state: { 
            message: currentLanguage === 'fa' ? 'ثبت‌نام با موفقیت انجام شد. لطفاً وارد شوید.' : 'Registration successful. Please log in.',
            email: formData.email
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: currentLanguage === 'fa' ?'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.' :'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <MedicalHistorySection
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <EmergencyContactSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <ConsentSection
            formData={formData}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-card rounded-lg border shadow-clinical-lg p-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-heading mb-2">
                {currentLanguage === 'fa' ? 'ثبت‌نام موفق!' : 'Registration Successful!'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {currentLanguage === 'fa' ?'حساب کاربری شما با موفقیت ایجاد شد. در حال انتقال به صفحه ورود...' :'Your account has been created successfully. Redirecting to login page...'
                }
              </p>
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {currentLanguage === 'fa' ? 'لطفاً صبر کنید...' : 'Please wait...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageToggle position="top-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RegistrationProgress
                currentStep={currentStep}
                totalSteps={4}
                completedSections={completedSections}
              />
              
              {/* Quick Navigation */}
              <div className="mt-6 bg-card rounded-lg border shadow-clinical p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  {currentLanguage === 'fa' ? 'پیوندهای سریع' : 'Quick Links'}
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/patient-login')}
                    className="w-full justify-start"
                    iconName="LogIn"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'ورود به حساب موجود' : 'Login to Existing Account'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/multi-step-assessment')}
                    className="w-full justify-start"
                    iconName="ClipboardList"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'شروع ارزیابی' : 'Start Assessment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border shadow-clinical">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="UserPlus" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground font-heading">
                      {currentLanguage === 'fa' ? 'ثبت‌نام بیمار' : 'Patient Registration'}
                    </h1>
                    <p className="text-muted-foreground">
                      {currentLanguage === 'fa' ?'برای شروع ارزیابی درد کمر، لطفاً حساب کاربری ایجاد کنید' :'Create an account to begin your back pain assessment'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-6">
                {renderCurrentSection()}
                
                {/* Error Messages */}
                {errors?.submit && (
                  <div className="mt-6 p-4 bg-error/10 rounded-lg border border-error/20">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Icon name="AlertCircle" size={16} className="text-error" />
                      <span className="text-sm font-medium text-error">
                        {errors?.submit}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'قبلی' : 'Previous'}
                  </Button>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    {currentStep < 4 ? (
                      <Button
                        variant="default"
                        onClick={handleNext}
                        iconName="ChevronRight"
                        iconPosition="right"
                      >
                        {currentLanguage === 'fa' ? 'بعدی' : 'Next'}
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        iconName="Check"
                        iconPosition="left"
                        disabled={completedSections?.length < 4}
                      >
                        {isSubmitting 
                          ? (currentLanguage === 'fa' ? 'در حال ثبت...' : 'Registering...')
                          : (currentLanguage === 'fa' ? 'تکمیل ثبت‌نام' : 'Complete Registration')
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;