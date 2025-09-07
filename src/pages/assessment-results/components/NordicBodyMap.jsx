import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const NordicBodyMap = ({ 
  painRegions = [], 
  onRegionClick,
  showLegend = true,
  className = '' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const bodyRegions = [
    {
      id: 'neck',
      name: currentLanguage === 'fa' ? 'گردن' : 'Neck',
      coordinates: '150,80,200,120',
      severity: painRegions?.find(r => r?.region === 'neck')?.severity || 0
    },
    {
      id: 'shoulders',
      name: currentLanguage === 'fa' ? 'شانه‌ها' : 'Shoulders',
      coordinates: '100,100,120,140,180,140,200,100',
      severity: painRegions?.find(r => r?.region === 'shoulders')?.severity || 0
    },
    {
      id: 'upper_back',
      name: currentLanguage === 'fa' ? 'کمر بالا' : 'Upper Back',
      coordinates: '130,120,170,180',
      severity: painRegions?.find(r => r?.region === 'upper_back')?.severity || 0
    },
    {
      id: 'elbows',
      name: currentLanguage === 'fa' ? 'آرنج‌ها' : 'Elbows',
      coordinates: '80,160,100,180,200,180,220,160',
      severity: painRegions?.find(r => r?.region === 'elbows')?.severity || 0
    },
    {
      id: 'wrists',
      name: currentLanguage === 'fa' ? 'مچ دست‌ها' : 'Wrists',
      coordinates: '60,200,80,220,220,220,240,200',
      severity: painRegions?.find(r => r?.region === 'wrists')?.severity || 0
    },
    {
      id: 'lower_back',
      name: currentLanguage === 'fa' ? 'کمر پایین' : 'Lower Back',
      coordinates: '130,180,170,220',
      severity: painRegions?.find(r => r?.region === 'lower_back')?.severity || 0
    },
    {
      id: 'hips',
      name: currentLanguage === 'fa' ? 'لگن' : 'Hips',
      coordinates: '120,220,180,250',
      severity: painRegions?.find(r => r?.region === 'hips')?.severity || 0
    },
    {
      id: 'knees',
      name: currentLanguage === 'fa' ? 'زانوها' : 'Knees',
      coordinates: '110,280,140,310,160,310,190,280',
      severity: painRegions?.find(r => r?.region === 'knees')?.severity || 0
    },
    {
      id: 'ankles',
      name: currentLanguage === 'fa' ? 'مچ پاها' : 'Ankles',
      coordinates: '100,340,150,360,150,360,200,340',
      severity: painRegions?.find(r => r?.region === 'ankles')?.severity || 0
    }
  ];

  const getSeverityColor = (severity) => {
    if (severity === 0) return '#E2E8F0'; // No pain - gray
    if (severity <= 3) return '#10B981'; // Mild - green
    if (severity <= 6) return '#F59E0B'; // Moderate - yellow
    return '#DC2626'; // Severe - red
  };

  const getSeverityLabel = (severity) => {
    if (severity === 0) return currentLanguage === 'fa' ? 'بدون درد' : 'No Pain';
    if (severity <= 3) return currentLanguage === 'fa' ? 'درد خفیف' : 'Mild Pain';
    if (severity <= 6) return currentLanguage === 'fa' ? 'درد متوسط' : 'Moderate Pain';
    return currentLanguage === 'fa' ? 'درد شدید' : 'Severe Pain';
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    if (onRegionClick) {
      onRegionClick(region);
    }
  };

  const painCount = painRegions?.filter(r => r?.severity > 0)?.length;
  const averagePain = painRegions?.length > 0 
    ? painRegions?.reduce((sum, r) => sum + r?.severity, 0) / painRegions?.length 
    : 0;

  return (
    <div className={`card-clinical p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-therapeutic-green/10 rounded-lg flex items-center justify-center">
            <Icon name="MapPin" size={20} className="text-therapeutic-green" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'نقشه درد بدن' : 'Body Pain Map'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 'پرسشنامه اسکلتی عضلانی نوردیک' : 'Nordic Musculoskeletal Questionnaire'}
            </p>
          </div>
        </div>
        <div className="text-right rtl:text-left">
          <div className="text-2xl font-bold font-data text-foreground">
            {painCount}/9
          </div>
          <div className="text-xs text-muted-foreground">
            {currentLanguage === 'fa' ? 'نواحی درد' : 'Pain Regions'}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Body Map SVG */}
        <div className="lg:col-span-2">
          <div className="relative bg-muted/30 rounded-lg p-8 flex items-center justify-center">
            <svg
              width="300"
              height="400"
              viewBox="0 0 300 400"
              className="max-w-full h-auto"
            >
              {/* Body Outline */}
              <path
                d="M150 20 C140 20 130 30 130 50 L130 80 C120 90 110 100 110 120 L110 140 C100 150 90 160 90 180 L90 200 C80 210 70 220 70 240 L70 260 C110 270 120 280 120 300 L120 320 C110 330 100 340 100 360 L100 380 C140 390 160 390 200 380 L200 360 C200 340 190 330 180 320 L180 300 C180 280 190 270 230 260 L230 240 C230 220 220 210 210 200 L210 180 C210 160 200 150 190 140 L190 120 C190 100 180 90 170 80 L170 50 C170 30 160 20 150 20 Z"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2"
              />

              {/* Interactive Regions */}
              {bodyRegions?.map((region) => (
                <g key={region?.id}>
                  <polygon
                    points={region?.coordinates}
                    fill={getSeverityColor(region?.severity)}
                    stroke="#64748B"
                    strokeWidth="1"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleRegionClick(region)}
                  />
                  {region?.severity > 0 && (
                    <circle
                      cx={region?.coordinates?.split(',')?.[0]}
                      cy={region?.coordinates?.split(',')?.[1]}
                      r="8"
                      fill="#DC2626"
                      className="animate-pulse"
                    />
                  )}
                </g>
              ))}

              {/* Labels */}
              {bodyRegions?.map((region) => (
                <text
                  key={`label-${region?.id}`}
                  x={region?.coordinates?.split(',')?.[0]}
                  y={parseInt(region?.coordinates?.split(',')?.[1]) - 10}
                  textAnchor="middle"
                  className="text-xs fill-current text-foreground font-medium"
                  style={{ fontSize: '10px' }}
                >
                  {region?.severity > 0 ? region?.severity : ''}
                </text>
              ))}
            </svg>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold font-data text-foreground">
                {painCount}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentLanguage === 'fa' ? 'نواحی درد' : 'Pain Areas'}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold font-data text-foreground">
                {averagePain?.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentLanguage === 'fa' ? 'میانگین درد' : 'Avg Pain'}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold font-data text-foreground">
                {Math.max(...painRegions?.map(r => r?.severity), 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentLanguage === 'fa' ? 'حداکثر درد' : 'Max Pain'}
              </div>
            </div>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="space-y-6">
          {showLegend && (
            <div>
              <h3 className="text-lg font-medium text-foreground font-heading mb-4">
                {currentLanguage === 'fa' ? 'راهنمای شدت درد' : 'Pain Severity Legend'}
              </h3>
              <div className="space-y-3">
                {[
                  { severity: 0, label: currentLanguage === 'fa' ? 'بدون درد' : 'No Pain' },
                  { severity: 2, label: currentLanguage === 'fa' ? 'درد خفیف (۱-۳)' : 'Mild Pain (1-3)' },
                  { severity: 5, label: currentLanguage === 'fa' ? 'درد متوسط (۴-۶)' : 'Moderate Pain (4-6)' },
                  { severity: 8, label: currentLanguage === 'fa' ? 'درد شدید (۷-۱۰)' : 'Severe Pain (7-10)' }
                ]?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: getSeverityColor(item?.severity) }}
                    />
                    <span className="text-sm text-foreground">{item?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Region Details */}
          {selectedRegion && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h4 className="text-sm font-medium text-primary mb-2">
                {selectedRegion?.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'شدت درد:' : 'Pain Severity:'}
                  </span>
                  <span className="font-data text-foreground">
                    {selectedRegion?.severity}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'وضعیت:' : 'Status:'}
                  </span>
                  <span className="font-medium text-foreground">
                    {getSeverityLabel(selectedRegion?.severity)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pain Regions List */}
          <div>
            <h3 className="text-lg font-medium text-foreground font-heading mb-4">
              {currentLanguage === 'fa' ? 'فهرست نواحی درد' : 'Pain Regions List'}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bodyRegions?.filter(region => region?.severity > 0)?.sort((a, b) => b?.severity - a?.severity)?.map((region) => (
                  <div
                    key={region?.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-clinical"
                    onClick={() => handleRegionClick(region)}
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getSeverityColor(region?.severity) }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {region?.name}
                      </span>
                    </div>
                    <span className="text-sm font-data text-muted-foreground">
                      {region?.severity}/10
                    </span>
                  </div>
                ))}
              {painRegions?.filter(r => r?.severity > 0)?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="CheckCircle" size={24} className="mx-auto mb-2 text-success" />
                  <p className="text-sm">
                    {currentLanguage === 'fa' ? 'هیچ ناحیه دردناکی گزارش نشده' : 'No pain regions reported'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NordicBodyMap;