import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = currentLanguage === 'fa' ?'ایمیل الزامی است' :'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = currentLanguage === 'fa' ?'فرمت ایمیل صحیح نیست' :'Invalid email format';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = currentLanguage === 'fa' ?'رمز عبور الزامی است' :'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = currentLanguage === 'fa' ?'رمز عبور باید حداقل ۶ کاراکتر باشد' :'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store user session
      localStorage.setItem('userSession', JSON.stringify({
        ...data,
        rememberMe: formData.rememberMe,
      }));

      // Dispatch event for header to update
      window.dispatchEvent(new Event('sessionChanged'));

      // Navigate based on role
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // Default to patient view
        // In a real app, you might want a dedicated patient dashboard first
        // For now, we'll assume they go to take an assessment.
        // This part needs a valid questionnaire ID.
        // Hardcoding one for now as a placeholder.
        navigate('/multi-step-assessment/60d5f2f9a9c8b4b2f8e1b9b1'); // Placeholder ID
      }

    } catch (error) {
      setErrors({
        general: error.message || (currentLanguage === 'fa' ?'خطا در ورود. لطفاً دوباره تلاش کنید' :'Login failed. Please try again')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    addToast(
      currentLanguage === 'fa' ?'لینک بازیابی رمز عبور به ایمیل شما ارسال خواهد شد' :'Password recovery link will be sent to your email',
      'success'
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card-clinical-elevated p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="User" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-heading mb-2">
            {currentLanguage === 'fa' ? 'ورود بیمار' : 'Patient Login'}
          </h1>
          <p className="text-muted-foreground font-caption">
            {currentLanguage === 'fa' ?'برای دسترسی به ارزیابی‌های خود وارد شوید' :'Sign in to access your assessments'
            }
          </p>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-error font-medium whitespace-pre-line">
                  {errors?.general}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <Input
            label={currentLanguage === 'fa' ? 'ایمیل' : 'Email Address'}
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'fa' ? 'example@email.com' : 'Enter your email'}
            error={errors?.email}
            required
            disabled={isLoading}
            className="transition-clinical"
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              label={currentLanguage === 'fa' ? 'رمز عبور' : 'Password'}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData?.password}
              onChange={handleInputChange}
              placeholder={currentLanguage === 'fa' ? 'رمز عبور خود را وارد کنید' : 'Enter your password'}
              error={errors?.password}
              required
              disabled={isLoading}
              className="transition-clinical"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 rtl:right-3 rtl:left-auto top-9 text-muted-foreground hover:text-foreground transition-clinical"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Checkbox
              label={currentLanguage === 'fa' ? 'مرا به خاطر بسپار' : 'Remember me'}
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
              size="sm"
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-clinical font-medium"
              disabled={isLoading}
            >
              {currentLanguage === 'fa' ? 'فراموشی رمز عبور؟' : 'Forgot password?'}
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="left"
            className="mt-8"
          >
            {currentLanguage === 'fa' ? 'ورود' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground font-caption">
              {currentLanguage === 'fa' ? 'یا' : 'or'}
            </span>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {currentLanguage === 'fa' ? 'حساب کاربری ندارید؟' : "Don't have an account?"}
          </p>
          <Button
            variant="outline"
            size="default"
            fullWidth
            onClick={() => navigate('/patient-registration')}
            iconName="UserPlus"
            iconPosition="left"
            disabled={isLoading}
          >
            {currentLanguage === 'fa' ? 'ثبت نام' : 'Create Account'}
          </Button>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-caption">
                {currentLanguage === 'fa' ?'برای تست سیستم از اطلاعات نمونه استفاده کنید' :'Use demo credentials to test the system'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;