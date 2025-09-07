import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    document.documentElement?.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');
  }, []);

  const professionalNavItems = [
    {
      section: currentLanguage === 'fa' ? 'مدیریت بیماران' : 'Patient Management',
      items: [
        { 
          path: '/patient-profile', 
          label: currentLanguage === 'fa' ? 'پروفایل بیمار' : 'Patient Profile', 
          icon: 'User',
          description: currentLanguage === 'fa' ? 'مشاهده و مدیریت اطلاعات بیمار' : 'View and manage patient information'
        },
        { 
          path: '/patient-search', 
          label: currentLanguage === 'fa' ? 'جستجوی بیمار' : 'Patient Search', 
          icon: 'Search',
          description: currentLanguage === 'fa' ? 'جستجو در پایگاه داده بیماران' : 'Search patient database'
        }
      ]
    },
    {
      section: currentLanguage === 'fa' ? 'تحلیل و گزارش' : 'Analytics & Reports',
      items: [
        { 
          path: '/admin-dashboard', 
          label: currentLanguage === 'fa' ? 'داشبورد مدیریت' : 'Admin Dashboard', 
          icon: 'LayoutDashboard',
          description: currentLanguage === 'fa' ? 'نمای کلی سیستم و آمار' : 'System overview and statistics'
        },
        { 
          path: '/assessment-analytics', 
          label: currentLanguage === 'fa' ? 'تحلیل ارزیابی‌ها' : 'Assessment Analytics', 
          icon: 'BarChart3',
          description: currentLanguage === 'fa' ? 'تحلیل نتایج ارزیابی‌ها' : 'Analyze assessment results'
        },
        { 
          path: '/population-health', 
          label: currentLanguage === 'fa' ? 'سلامت جمعیت' : 'Population Health', 
          icon: 'Users',
          description: currentLanguage === 'fa' ? 'آمار سلامت جمعیت' : 'Population health statistics'
        }
      ]
    },
    {
      section: currentLanguage === 'fa' ? 'ابزارهای کلینیکی' : 'Clinical Tools',
      items: [
        { 
          path: '/predictive-models', 
          label: currentLanguage === 'fa' ? 'مدل‌های پیش‌بینی' : 'Predictive Models', 
          icon: 'Brain',
          description: currentLanguage === 'fa' ? 'مدل‌های هوش مصنوعی تشخیص' : 'AI diagnostic models'
        },
        { 
          path: '/clinical-guidelines', 
          label: currentLanguage === 'fa' ? 'راهنمای بالینی' : 'Clinical Guidelines', 
          icon: 'BookOpen',
          description: currentLanguage === 'fa' ? 'راهنماهای تشخیص و درمان' : 'Diagnostic and treatment guidelines'
        }
      ]
    }
  ];

  const quickActions = [
    { 
      label: currentLanguage === 'fa' ? 'بیمار جدید' : 'New Patient', 
      icon: 'UserPlus', 
      action: () => navigate('/patient-registration'),
      variant: 'default'
    },
    { 
      label: currentLanguage === 'fa' ? 'ارزیابی سریع' : 'Quick Assessment', 
      icon: 'Zap', 
      action: () => navigate('/multi-step-assessment'),
      variant: 'outline'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const PatientSearchWidget = () => (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
        <Icon name="Search" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {currentLanguage === 'fa' ? 'جستجوی سریع بیمار' : 'Quick Patient Search'}
        </span>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder={currentLanguage === 'fa' ? 'نام، کد ملی یا شماره پرونده' : 'Name, ID, or file number'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-clinical"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-clinical"
          >
            <Icon name="X" size={14} />
          </button>
        )}
      </div>
    </div>
  );

  const SystemStatus = () => (
    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-success">
          {currentLanguage === 'fa' ? 'سیستم آنلاین' : 'System Online'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {currentLanguage === 'fa' ? 'آخرین به‌روزرسانی: ۵ دقیقه پیش' : 'Last updated: 5 minutes ago'}
      </p>
    </div>
  );

  return (
    <aside className={`fixed left-0 rtl:right-0 rtl:left-auto top-16 h-[calc(100vh-4rem)] bg-card border-r rtl:border-l rtl:border-r-0 border-border shadow-clinical-md z-40 transition-all duration-300 ease-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'پنل حرفه‌ای' : 'Professional Panel'}
              </h2>
            )}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="p-1"
              >
                <Icon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={16} 
                  className={currentLanguage === 'fa' ? 'rotate-180' : ''}
                />
              </Button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Patient Search Widget */}
            {!isCollapsed && <PatientSearchWidget />}

            {/* Quick Actions */}
            {!isCollapsed && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {currentLanguage === 'fa' ? 'اقدامات سریع' : 'Quick Actions'}
                </h3>
                <div className="space-y-2">
                  {quickActions?.map((action, index) => (
                    <Button
                      key={index}
                      variant={action?.variant}
                      size="sm"
                      onClick={action?.action}
                      className="w-full justify-start"
                      iconName={action?.icon}
                      iconPosition="left"
                    >
                      {action?.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Sections */}
            <nav className="space-y-6">
              {professionalNavItems?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-2">
                  {!isCollapsed && (
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-2">
                      {section?.section}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section?.items?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className={`w-full nav-item-clinical ${
                          location?.pathname === item?.path ? 'active' : ''
                        } flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-clinical group`}
                        title={isCollapsed ? item?.label : ''}
                      >
                        <Icon name={item?.icon} size={18} className="flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="flex-1 text-left rtl:text-right">
                            <div className="font-medium">{item?.label}</div>
                            <div className="text-xs text-muted-foreground group-hover:text-foreground transition-clinical">
                              {item?.description}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-4">
          {!isCollapsed && <SystemStatus />}
          
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentLanguage === 'fa' ? 'دکتر احمدی' : 'Dr. Ahmadi'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentLanguage === 'fa' ? 'متخصص ارتوپدی' : 'Orthopedic Specialist'}
                  </p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/patient-login')}
              className={isCollapsed ? 'w-full' : ''}
              title={currentLanguage === 'fa' ? 'خروج' : 'Logout'}
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;