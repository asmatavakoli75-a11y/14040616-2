import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useLanguage } from './LanguageToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const currentLanguage = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        try {
          setSession(JSON.parse(userSession));
        } catch (error) {
          localStorage.removeItem('userSession');
          setSession(null);
        }
      } else {
        setSession(null);
      }
    };
    checkSession();
    // Also listen for a custom event that might be dispatched on login/logout
    window.addEventListener('sessionChanged', checkSession);
    return () => window.removeEventListener('sessionChanged', checkSession);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setSession(null);
    window.dispatchEvent(new Event('sessionChanged')); // Inform other components
    navigate('/patient-login');
  };

  // --- Define Navigation Items based on context ---
  const professionalRoutes = ['/admin-dashboard', '/patient-profile'];
  const patientLoggedInRoutes = ['/multi-step-assessment', '/assessment-results'];

  const getNavItems = () => {
    // Professional/Admin View
    if (professionalRoutes.includes(location.pathname)) {
      return [
        { path: '/patient-profile', label: currentLanguage === 'fa' ? 'پروفایل بیمار' : 'Patient Profile', icon: 'User' },
        { path: '/admin-dashboard', label: currentLanguage === 'fa' ? 'داشبورد مدیریت' : 'Admin Dashboard', icon: 'LayoutDashboard' }
      ];
    }

    // Logged-in Patient View (Assessment/Results)
    if (session && patientLoggedInRoutes.includes(location.pathname)) {
      // Per user request, show no selectable menu items to enforce the linear flow
      return [];
    }

    // Default Public/Logged-out View
    return [
      { path: '/patient-login', label: currentLanguage === 'fa' ? 'ورود' : 'Login', icon: 'LogIn' },
      { path: '/patient-registration', label: currentLanguage === 'fa' ? 'ثبت نام' : 'Registration', icon: 'UserPlus' }
    ];
  };

  const currentNavItems = getNavItems();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Activity" size={24} color="white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'سیستم پیش‌بینی CLBP' : 'CLBP Predictive System'}
        </span>
        <span className="text-xs text-muted-foreground font-caption">
          {currentLanguage === 'fa' ? 'سیستم پیشرفته تشخیص پزشکی' : 'Advanced Medical Assessment'}
        </span>
      </div>
    </div>
  );

  return (
    <header className="nav-clinical sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {currentNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item-clinical ${
                  location.pathname === item.path ? 'active' : ''
                } flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-clinical`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             {/* Patient Portal Button (only in admin area) */}
            {professionalRoutes.includes(location.pathname) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patient-login')}
                iconName="Users"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'پورتال بیمار' : 'Patient Portal'}
              </Button>
            )}

            {/* Logout Button for logged-in users */}
            {session && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                iconName="LogOut"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'خروج' : 'Logout'}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
             {currentNavItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="mobile-nav-overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="mobile-nav-panel">
            <div className="p-4 border-b border-border">
              <Logo />
            </div>
            <nav className="p-4 space-y-2">
              {currentNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full nav-item-clinical ${
                    location.pathname === item.path ? 'active' : ''
                  } flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-md text-sm font-medium transition-clinical`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;