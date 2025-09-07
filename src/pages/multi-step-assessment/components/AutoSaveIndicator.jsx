import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AutoSaveIndicator = ({ 
  lastSaved, 
  isSaving, 
  hasUnsavedChanges, 
  currentLanguage 
}) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now - lastSaved) / 1000);
      
      if (diff < 60) {
        setTimeAgo(currentLanguage === 'fa' ? 'همین الان' : 'just now');
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(currentLanguage === 'fa' 
          ? `${minutes} دقیقه پیش` 
          : `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        );
      } else {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(currentLanguage === 'fa' 
          ? `${hours} ساعت پیش` 
          : `${hours} hour${hours > 1 ? 's' : ''} ago`
        );
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [lastSaved, currentLanguage]);

  const getSaveStatus = () => {
    if (isSaving) {
      return {
        icon: 'Loader2',
        text: currentLanguage === 'fa' ? 'در حال ذخیره...' : 'Saving...',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
        iconClass: 'animate-spin'
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: 'AlertCircle',
        text: currentLanguage === 'fa' ? 'تغییرات ذخیره نشده' : 'Unsaved changes',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        iconClass: ''
      };
    }
    
    if (lastSaved) {
      return {
        icon: 'Check',
        text: currentLanguage === 'fa' ? `ذخیره شده ${timeAgo}` : `Saved ${timeAgo}`,
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        iconClass: ''
      };
    }
    
    return {
      icon: 'Save',
      text: currentLanguage === 'fa' ? 'آماده ذخیره' : 'Ready to save',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-border',
      iconClass: ''
    };
  };

  const status = getSaveStatus();

  return (
    <div className={`fixed bottom-4 right-4 rtl:left-4 rtl:right-auto z-40 ${status?.bgColor} ${status?.borderColor} border rounded-lg px-3 py-2 shadow-clinical-md transition-all duration-300`}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Icon 
          name={status?.icon} 
          size={14} 
          className={`${status?.color} ${status?.iconClass}`} 
        />
        <span className={`text-xs font-medium ${status?.color}`}>
          {status?.text}
        </span>
      </div>
      {lastSaved && (
        <div className="text-xs text-muted-foreground mt-1">
          {lastSaved?.toLocaleTimeString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};

export default AutoSaveIndicator;