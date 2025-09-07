import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle, { useLanguage } from './LanguageToggle';
import Button from './Button';

const Footer = () => {
  const navigate = useNavigate();
  const currentLanguage = useLanguage();

  return (
    <footer className="w-full p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Professional Access Button (bottom-left) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin-dashboard')}
          iconName="Shield"
          iconPosition="left"
        >
          {currentLanguage === 'fa' ? 'دسترسی حرفه‌ای' : 'Professional Access'}
        </Button>

        {/* Language Toggle (bottom-right) */}
        <LanguageToggle position="inline" size="sm" />
      </div>
    </footer>
  );
};

export default Footer;
