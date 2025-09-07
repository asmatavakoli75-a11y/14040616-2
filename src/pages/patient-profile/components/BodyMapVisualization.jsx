import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BodyMapVisualization = ({ currentLanguage }) => {
  const [selectedPhase, setSelectedPhase] = useState('T0');
  const [viewMode, setViewMode] = useState('front');

  const bodyRegions = {
    T0: {
      front: [
        { id: 'neck', x: 50, y: 15, severity: 2, active: true },
        { id: 'shoulder_left', x: 35, y: 25, severity: 1, active: true },
        { id: 'shoulder_right', x: 65, y: 25, severity: 0, active: false },
        { id: 'upper_back', x: 50, y: 30, severity: 3, active: true },
        { id: 'lower_back', x: 50, y: 45, severity: 4, active: true },
        { id: 'hip_left', x: 40, y: 55, severity: 2, active: true },
        { id: 'hip_right', x: 60, y: 55, severity: 2, active: true },
        { id: 'knee_left', x: 42, y: 70, severity: 1, active: true },
        { id: 'knee_right', x: 58, y: 70, severity: 0, active: false }
      ],
      back: [
        { id: 'neck_back', x: 50, y: 15, severity: 2, active: true },
        { id: 'upper_back_back', x: 50, y: 30, severity: 4, active: true },
        { id: 'lower_back_back', x: 50, y: 45, severity: 4, active: true },
        { id: 'buttocks_left', x: 45, y: 55, severity: 3, active: true },
        { id: 'buttocks_right', x: 55, y: 55, severity: 3, active: true }
      ]
    },
    T1: {
      front: [
        { id: 'neck', x: 50, y: 15, severity: 1, active: true },
        { id: 'shoulder_left', x: 35, y: 25, severity: 0, active: false },
        { id: 'upper_back', x: 50, y: 30, severity: 2, active: true },
        { id: 'lower_back', x: 50, y: 45, severity: 3, active: true },
        { id: 'hip_left', x: 40, y: 55, severity: 1, active: true },
        { id: 'hip_right', x: 60, y: 55, severity: 1, active: true },
        { id: 'knee_left', x: 42, y: 70, severity: 0, active: false }
      ],
      back: [
        { id: 'neck_back', x: 50, y: 15, severity: 1, active: true },
        { id: 'upper_back_back', x: 50, y: 30, severity: 3, active: true },
        { id: 'lower_back_back', x: 50, y: 45, severity: 3, active: true },
        { id: 'buttocks_left', x: 45, y: 55, severity: 2, active: true },
        { id: 'buttocks_right', x: 55, y: 55, severity: 2, active: true }
      ]
    },
    T2: {
      front: [
        { id: 'lower_back', x: 50, y: 45, severity: 2, active: true },
        { id: 'hip_left', x: 40, y: 55, severity: 1, active: true },
        { id: 'hip_right', x: 60, y: 55, severity: 1, active: true }
      ],
      back: [
        { id: 'lower_back_back', x: 50, y: 45, severity: 2, active: true },
        { id: 'buttocks_left', x: 45, y: 55, severity: 1, active: true },
        { id: 'buttocks_right', x: 55, y: 55, severity: 1, active: true }
      ]
    }
  };

  const phases = [
    { id: 'T0', name: currentLanguage === 'fa' ? 'اولیه' : 'Initial', date: '2024-12-05' },
    { id: 'T1', name: currentLanguage === 'fa' ? '۱ ماه' : '1 Month', date: '2025-01-05' },
    { id: 'T2', name: currentLanguage === 'fa' ? '۳ ماه' : '3 Months', date: '2025-03-05' }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      0: '#10B981', // No pain - green
      1: '#84CC16', // Mild - light green
      2: '#F59E0B', // Moderate - yellow
      3: '#F97316', // Severe - orange
      4: '#DC2626'  // Very severe - red
    };
    return colors?.[severity] || '#6B7280';
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      0: currentLanguage === 'fa' ? 'بدون درد' : 'No Pain',
      1: currentLanguage === 'fa' ? 'خفیف' : 'Mild',
      2: currentLanguage === 'fa' ? 'متوسط' : 'Moderate',
      3: currentLanguage === 'fa' ? 'شدید' : 'Severe',
      4: currentLanguage === 'fa' ? 'بسیار شدید' : 'Very Severe'
    };
    return labels?.[severity] || '';
  };

  const currentRegions = bodyRegions?.[selectedPhase]?.[viewMode] || [];

  return (
    <div className="card-clinical p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading mb-4 sm:mb-0">
          {currentLanguage === 'fa' ? 'نقشه درد بدن' : 'Body Pain Map'}
        </h2>
        
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button
            variant={viewMode === 'front' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('front')}
          >
            {currentLanguage === 'fa' ? 'جلو' : 'Front'}
          </Button>
          
          <Button
            variant={viewMode === 'back' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('back')}
          >
            {currentLanguage === 'fa' ? 'پشت' : 'Back'}
          </Button>
        </div>
      </div>
      {/* Phase Selection */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse bg-muted/50 p-2 rounded-lg">
          {phases?.map((phase) => (
            <button
              key={phase?.id}
              onClick={() => setSelectedPhase(phase?.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-clinical ${
                selectedPhase === phase?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <div className="text-center">
                <div>{phase?.name}</div>
                <div className="text-xs opacity-75">{phase?.date}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Body Map */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-96 mx-auto">
            {/* Body Outline SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full border border-border rounded-lg bg-muted/20"
            >
              {/* Simple body outline */}
              <path
                d={viewMode === 'front' 
                  ? "M50 10 C45 10 40 15 40 20 L35 25 L30 30 L35 35 L40 40 L45 50 L40 60 L35 70 L40 80 L45 90 L55 90 L60 80 L65 70 L60 60 L55 50 L60 40 L65 35 L70 30 L65 25 L60 20 C60 15 55 10 50 10 Z" :"M50 10 C45 10 40 15 40 20 L35 25 L30 30 L35 35 L40 40 L45 50 L40 60 L35 70 L40 80 L45 90 L55 90 L60 80 L65 70 L60 60 L55 50 L60 40 L65 35 L70 30 L65 25 L60 20 C60 15 55 10 50 10 Z"
                }
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
              
              {/* Pain Points */}
              {currentRegions?.map((region) => (
                <g key={region?.id}>
                  <circle
                    cx={region?.x}
                    cy={region?.y}
                    r={region?.severity + 2}
                    fill={getSeverityColor(region?.severity)}
                    opacity={region?.active ? 0.8 : 0.3}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={region?.x}
                    cy={region?.y}
                    r={region?.severity + 4}
                    fill={getSeverityColor(region?.severity)}
                    opacity={region?.active ? 0.3 : 0.1}
                    className="transition-all duration-300"
                  />
                </g>
              ))}
            </svg>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            {currentLanguage === 'fa' 
              ? `نمای ${viewMode === 'front' ? 'جلوی' : 'پشت'} بدن - مرحله ${selectedPhase}`
              : `${viewMode === 'front' ? 'Front' : 'Back'} view - Phase ${selectedPhase}`
            }
          </p>
        </div>

        {/* Pain Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground mb-4">
            {currentLanguage === 'fa' ? 'جزئیات درد' : 'Pain Details'}
          </h3>
          
          {/* Severity Legend */}
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">
              {currentLanguage === 'fa' ? 'راهنمای شدت درد' : 'Pain Severity Legend'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3, 4]?.map((severity) => (
                <div key={severity} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getSeverityColor(severity) }}
                  />
                  <span className="text-sm text-foreground">
                    {getSeverityLabel(severity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Pain Regions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'نواحی دردناک فعال' : 'Active Pain Regions'}
            </h4>
            
            {currentRegions?.filter(region => region?.active)?.length === 0 ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm">
                  {currentLanguage === 'fa' ? 'هیچ درد فعالی گزارش نشده' : 'No active pain reported'}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {currentRegions?.filter(region => region?.active)?.sort((a, b) => b?.severity - a?.severity)?.map((region) => (
                    <div key={region?.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getSeverityColor(region?.severity) }}
                        />
                        <span className="text-sm font-medium text-foreground capitalize">
                          {region?.id?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm text-muted-foreground">
                          {getSeverityLabel(region?.severity)}
                        </span>
                        <span className="text-sm font-data text-foreground">
                          {region?.severity}/4
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Comparison with Previous Phase */}
          {selectedPhase !== 'T0' && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Icon name="TrendingDown" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-primary mb-1">
                    {currentLanguage === 'fa' ? 'مقایسه با مرحله قبل' : 'Comparison with Previous Phase'}
                  </h4>
                  <p className="text-sm text-foreground">
                    {currentLanguage === 'fa' ?'کاهش قابل توجه در تعداد نواحی دردناک و شدت کلی درد مشاهده می‌شود.' :'Significant reduction in number of painful regions and overall pain intensity observed.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyMapVisualization;