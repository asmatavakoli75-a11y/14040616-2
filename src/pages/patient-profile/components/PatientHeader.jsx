import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientHeader = ({ patient, onEdit, onSendReminder, onGenerateReport, currentLanguage }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'status-badge-success',
        icon: 'CheckCircle',
        text: currentLanguage === 'fa' ? 'فعال' : 'Active'
      },
      pending: {
        color: 'status-badge-warning',
        icon: 'Clock',
        text: currentLanguage === 'fa' ? 'در انتظار' : 'Pending'
      },
      completed: {
        color: 'status-badge-success',
        icon: 'Check',
        text: currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`status-badge ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />
        {config?.text}
      </span>
    );
  };

  return (
    <div className="card-clinical-elevated p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Patient Info */}
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Icon name="User" size={40} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <h1 className="text-2xl font-bold text-foreground font-heading">
                {`${patient?.firstName} ${patient?.lastName}`}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                iconName="Edit2"
                className="opacity-60 hover:opacity-100"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Icon name="Mail" size={14} />
                <span className="truncate">{patient?.email}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Icon name="Calendar" size={14} />
                <span>
                  {currentLanguage === 'fa' ? 'عضو از:' : 'Member since:'} {new Date(patient?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
          <Button
            variant="default"
            onClick={onSendReminder}
            iconName="Send"
            iconPosition="left"
            className="w-full"
          >
            {currentLanguage === 'fa' ? 'ارسال یادآوری' : 'Send Reminder'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onGenerateReport}
            iconName="FileText"
            iconPosition="left"
            className="w-full"
          >
            {currentLanguage === 'fa' ? 'تولید گزارش' : 'Generate Report'}
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => {}}
            iconName="Calendar"
            iconPosition="left"
            className="w-full"
          >
            {currentLanguage === 'fa' ? 'زمان‌بندی' : 'Schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;