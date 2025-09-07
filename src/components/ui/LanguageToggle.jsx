import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const LanguageToggle = ({ 
  className = '',
  size = 'default',
  variant = 'ghost',
  showLabel = true,
  position = 'top-right'
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    applyLanguageSettings(savedLanguage);
  }, []);

  const applyLanguageSettings = (language) => {
    // Set document direction and language
    document.documentElement?.setAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
    document.documentElement?.setAttribute('lang', language);
    
    // Apply font family based on language
    const bodyElement = document.body;
    if (language === 'fa') {
      bodyElement.style.fontFamily = "'Vazirmatn', sans-serif";
    } else {
      bodyElement.style.fontFamily = "'Inter', sans-serif";
    }
  };

  const toggleLanguage = async () => {
    setIsChanging(true);
    
    // Simulate brief loading for smooth transition
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    
    // Save to localStorage
    localStorage.setItem('language', newLanguage);
    
    // Update state
    setCurrentLanguage(newLanguage);
    
    // Apply language settings
    applyLanguageSettings(newLanguage);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage } 
    }));
    
    setIsChanging(false);
  };

  const getLanguageLabel = () => {
    return currentLanguage === 'fa' ? 'English' : 'فارسی';
  };

  const getLanguageCode = () => {
    return currentLanguage === 'fa' ? 'EN' : 'فا';
  };

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 rtl:left-4 rtl:right-auto z-50',
    'top-left': 'fixed top-4 left-4 rtl:right-4 rtl:left-auto z-50',
    'inline': '',
    'header': 'relative'
  };

  return (
    <div className={`${positionClasses?.[position]} ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={toggleLanguage}
        disabled={isChanging}
        className={`flex items-center gap-2 rtl:space-x-reverse transition-clinical flex-shrink-0 whitespace-nowrap ${
          isChanging ? 'opacity-75' : ''
        }`}
        title={currentLanguage === 'fa' ? 'تغییر به انگلیسی' : 'Switch to Farsi'}
      >
        {/* Globe Icon */}
        <Icon 
          name={isChanging ? "Loader2" : "Globe"} 
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
          className={isChanging ? 'animate-spin' : ''}
        />
        
        {/* Language Label */}
        {showLabel && (
          <span className="font-medium">
            {size === 'sm' ? getLanguageCode() : getLanguageLabel()}
          </span>
        )}
        
        {/* Direction Indicator */}
        <Icon 
          name="ArrowRightLeft" 
          size={size === 'sm' ? 12 : 14}
          className="opacity-60"
        />
      </Button>
      {/* Language Status Indicator */}
      {position !== 'inline' && (
        <div className="absolute -bottom-1 -right-1 rtl:-left-1 rtl:-right-auto">
          <div className={`w-3 h-3 rounded-full border-2 border-background ${
            currentLanguage === 'fa' ? 'bg-therapeutic-green' : 'bg-primary'
          } transition-clinical`} />
        </div>
      )}
      {/* Tooltip for accessibility */}
      <div className="sr-only">
        {currentLanguage === 'fa' ?'تغییر زبان به انگلیسی - کلید میانبر: Alt + L' :'Switch language to Farsi - Shortcut: Alt + L'
        }
      </div>
    </div>
  );
};

// Hook for other components to use current language
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return currentLanguage;
};

// Utility function to get text based on current language
export const getLocalizedText = (englishText, farsiText) => {
  const currentLanguage = localStorage.getItem('language') || 'en';
  return currentLanguage === 'fa' ? farsiText : englishText;
};

export default LanguageToggle;