import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import QuestionnaireManager from './QuestionnaireManager';
import ModelTrainingPanel from './ModelTrainingPanel';
import { useToast } from '../../../context/ToastContext';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const SettingsPanel = ({ currentLanguage }) => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    appName: '',
    emergencyContact: { name: '', phone: '' },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        setError('Failed to load settings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Save appName
      await axios.put('/api/settings/appName', { value: settings.appName });
      // Save emergencyContact
      await axios.put('/api/settings/emergencyContact', { value: settings.emergencyContact });

      addToast(currentLanguage === 'fa' ? 'تنظیمات با موفقیت ذخیره شد.' : 'Settings saved successfully.', 'success');
    } catch (err) {
      setError('Failed to save settings.');
      addToast(currentLanguage === 'fa' ? 'خطا در ذخیره تنظیمات.' : 'Failed to save settings.', 'error');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={currentLanguage === 'fa' ? 'در حال بارگذاری تنظیمات...' : 'Loading settings...'} />;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return (
    <div className="card-clinical p-6">
      <h2 className="text-2xl font-semibold text-foreground font-heading mb-6">
        {currentLanguage === 'fa' ? 'تنظیمات سیستم' : 'System Settings'}
      </h2>

      <div className="space-y-8 max-w-2xl">
        {/* App Name Setting */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            {currentLanguage === 'fa' ? 'تنظیمات عمومی' : 'General Settings'}
          </h3>
          <Input
            label={currentLanguage === 'fa' ? 'نام اپلیکیشن' : 'Application Name'}
            name="appName"
            value={settings.appName}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'fa' ? 'نامی برای نمایش در هدر' : 'Name to display in the header'}
          />
        </div>

        {/* Emergency Contact Setting */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            {currentLanguage === 'fa' ? 'تماس اضطراری' : 'Emergency Contact'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={currentLanguage === 'fa' ? 'نام کامل' : 'Full Name'}
              name="name"
              value={settings.emergencyContact?.name || ''}
              onChange={handleEmergencyContactChange}
              placeholder={currentLanguage === 'fa' ? 'مثال: مرکز پشتیبانی' : 'e.g., Support Center'}
            />
            <Input
              label={currentLanguage === 'fa' ? 'شماره تلفن' : 'Phone Number'}
              name="phone"
              value={settings.emergencyContact?.phone || ''}
              onChange={handleEmergencyContactChange}
              placeholder="123-456-7890"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border">
          <Button onClick={handleSaveChanges} loading={isSaving} iconName="Save" iconPosition="left">
            {currentLanguage === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="my-8 border-b border-border"></div>

      <QuestionnaireManager currentLanguage={currentLanguage} />
    
      <div className="my-8 border-b border-border"></div>
      <ModelTrainingPanel currentLanguage={currentLanguage} />
    </div>
  );
};

export default SettingsPanel;
