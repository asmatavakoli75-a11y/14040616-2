import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LanguageToggle from '../../components/ui/LanguageToggle';
import LoginForm from './components/LoginForm';
import SecurityFeatures from './components/SecurityFeatures';
import AccessibilityInfo from './components/AccessibilityInfo';
import Footer from '../../components/ui/Footer';

const PatientLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const session = JSON.parse(userSession);
        if (session?.rememberMe) {
          navigate('/multi-step-assessment');
          return;
        }
      } catch (error) {
        localStorage.removeItem('userSession');
      }
    }

    // Set page title
    document.title = 'Patient Login - CLBP Predictive System';
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      {/* Language Toggle */}
      <LanguageToggle position="top-right" />
      {/* Main Content */}
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
            
            {/* Left Column - Login Form */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
              <LoginForm />
              <AccessibilityInfo />
            </div>

            {/* Right Column - Security Features */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
              <SecurityFeatures />
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PatientLogin;