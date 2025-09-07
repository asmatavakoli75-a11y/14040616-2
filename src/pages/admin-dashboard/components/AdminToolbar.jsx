import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../context/ToastContext';

const AdminToolbar = ({ onExport, currentLanguage }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { addToast } = useToast();

  const handlePlaceholderClick = (featureName) => {
    addToast(`${featureName} ${currentLanguage === 'fa' ? 'هنوز پیاده‌سازی نشده است.' : 'is not implemented yet.'}`);
  };

  const exportFormats = [
    { 
      format: 'csv', 
      label: 'CSV',
      description: currentLanguage === 'fa' ? 'داده‌های خام' : 'Raw data',
      icon: 'FileText'
    },
    { 
      format: 'excel', 
      label: 'Excel',
      description: currentLanguage === 'fa' ? 'جدول کامل' : 'Full spreadsheet',
      icon: 'FileSpreadsheet'
    },
    { 
      format: 'pdf', 
      label: 'PDF',
      description: currentLanguage === 'fa' ? 'گزارش فرمت‌بندی شده' : 'Formatted report',
      icon: 'FileType'
    }
  ];

  const handleExport = (format) => {
    onExport?.(format);
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Data Export */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExportMenu(!showExportMenu)}
          iconName="Download"
          iconPosition="left"
          className="min-w-[120px]"
        >
          {currentLanguage === 'fa' ? 'صادرات داده' : 'Export Data'}
          <Icon name="ChevronDown" size={14} className="ml-1 rtl:mr-1 rtl:ml-0" />
        </Button>
        
        {showExportMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowExportMenu(false)}
            />
            <div className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-64 bg-card border border-border rounded-lg shadow-clinical-lg z-20">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border mb-2">
                  {currentLanguage === 'fa' ? 'انتخاب فرمت صادرات' : 'Select Export Format'}
                </div>
                {exportFormats?.map((item) => (
                  <button
                    key={item?.format}
                    onClick={() => handleExport(item?.format)}
                    className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-md hover:bg-muted/50 transition-clinical"
                  >
                    <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                    <div className="flex-1 text-left rtl:text-right">
                      <p className="text-sm font-medium text-foreground">
                        {item?.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item?.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {/* Audit Logs */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePlaceholderClick(currentLanguage === 'fa' ? 'لاگ‌ها' : 'Audit Logs')}
        iconName="FileText"
        iconPosition="left"
      >
        {currentLanguage === 'fa' ? 'لاگ‌ها' : 'Audit Logs'}
      </Button>
      {/* User Management */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePlaceholderClick(currentLanguage === 'fa' ? 'کاربران' : 'Users')}
        iconName="Users"
        iconPosition="left"
      >
        {currentLanguage === 'fa' ? 'کاربران' : 'Users'}
      </Button>
      {/* System Configuration */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePlaceholderClick(currentLanguage === 'fa' ? 'تنظیمات' : 'Settings')}
        iconName="Settings"
        iconPosition="left"
      >
        {currentLanguage === 'fa' ? 'تنظیمات' : 'Settings'}
      </Button>
      {/* Refresh Data */}
      <Button
        variant="default"
        size="sm"
        onClick={() => window.location?.reload()}
        iconName="RefreshCw"
        iconPosition="left"
      >
        {currentLanguage === 'fa' ? 'بروزرسانی' : 'Refresh'}
      </Button>
    </div>
  );
};

export default AdminToolbar;