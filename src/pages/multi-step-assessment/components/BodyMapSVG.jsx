import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BodyMapSVG = ({ 
  selectedRegions, 
  onRegionClick, 
  currentLanguage,
  showLabels = true 
}) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const bodyRegions = [
    { 
      id: 'neck', 
      name: currentLanguage === 'fa' ? 'گردن' : 'Neck',
      path: "M150,50 L170,50 L175,70 L145,70 Z",
      center: { x: 160, y: 60 }
    },
    { 
      id: 'shoulders', 
      name: currentLanguage === 'fa' ? 'شانه‌ها' : 'Shoulders',
      path: "M120,70 L200,70 L210,90 L110,90 Z",
      center: { x: 160, y: 80 }
    },
    { 
      id: 'upper_back', 
      name: currentLanguage === 'fa' ? 'پشت بالا' : 'Upper Back',
      path: "M130,90 L190,90 L185,130 L135,130 Z",
      center: { x: 160, y: 110 }
    },
    { 
      id: 'lower_back', 
      name: currentLanguage === 'fa' ? 'کمر' : 'Lower Back',
      path: "M135,130 L185,130 L180,170 L140,170 Z",
      center: { x: 160, y: 150 }
    },
    { 
      id: 'hips', 
      name: currentLanguage === 'fa' ? 'لگن' : 'Hips',
      path: "M140,170 L180,170 L175,190 L145,190 Z",
      center: { x: 160, y: 180 }
    },
    { 
      id: 'left_arm', 
      name: currentLanguage === 'fa' ? 'بازوی چپ' : 'Left Arm',
      path: "M110,90 L130,90 L125,150 L105,150 Z",
      center: { x: 117, y: 120 }
    },
    { 
      id: 'right_arm', 
      name: currentLanguage === 'fa' ? 'بازوی راست' : 'Right Arm',
      path: "M190,90 L210,90 L215,150 L195,150 Z",
      center: { x: 202, y: 120 }
    },
    { 
      id: 'left_leg', 
      name: currentLanguage === 'fa' ? 'پای چپ' : 'Left Leg',
      path: "M145,190 L160,190 L155,280 L135,280 Z",
      center: { x: 150, y: 235 }
    },
    { 
      id: 'right_leg', 
      name: currentLanguage === 'fa' ? 'پای راست' : 'Right Leg',
      path: "M160,190 L175,190 L185,280 L165,280 Z",
      center: { x: 170, y: 235 }
    }
  ];

  const isRegionSelected = (regionId) => {
    return selectedRegions?.includes(regionId);
  };

  const getRegionColor = (regionId) => {
    if (isRegionSelected(regionId)) {
      return '#DC2626'; // error color for pain areas
    }
    if (hoveredRegion === regionId) {
      return '#2563EB'; // primary color for hover
    }
    return '#E2E8F0'; // border color for default
  };

  const getRegionOpacity = (regionId) => {
    if (isRegionSelected(regionId)) return 0.8;
    if (hoveredRegion === regionId) return 0.6;
    return 0.3;
  };

  return (
    <div className="bg-card rounded-lg border shadow-clinical p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'نقشه بدن - نوردیک' : 'Nordic Body Map'}
        </h3>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="text-sm font-data text-primary">
            {selectedRegions?.length}/9
          </span>
        </div>
      </div>
      <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-2 rtl:space-x-reverse">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-primary">
            {currentLanguage === 'fa' ?'روی نواحی بدن که در آن درد یا ناراحتی احساس می‌کنید کلیک کنید. می‌توانید چندین ناحیه را انتخاب کنید.' :'Click on the body regions where you experience pain or discomfort. You can select multiple areas.'
            }
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative">
          <svg
            width="320"
            height="300"
            viewBox="0 0 320 300"
            className="border border-border rounded-lg bg-background"
          >
            {/* Body outline */}
            <path
              d="M160,30 L150,50 L120,70 L110,90 L105,150 L135,280 L155,280 L160,190 L165,280 L185,280 L215,150 L210,90 L200,70 L170,50 Z"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Interactive regions */}
            {bodyRegions?.map((region) => (
              <g key={region?.id}>
                <path
                  d={region?.path}
                  fill={getRegionColor(region?.id)}
                  fillOpacity={getRegionOpacity(region?.id)}
                  stroke={getRegionColor(region?.id)}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 hover:stroke-width-3"
                  onMouseEnter={() => setHoveredRegion(region?.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => onRegionClick(region?.id)}
                />
                
                {/* Region labels */}
                {showLabels && (
                  <text
                    x={region?.center?.x}
                    y={region?.center?.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-current pointer-events-none"
                    fill={isRegionSelected(region?.id) ? '#FFFFFF' : '#64748B'}
                  >
                    {region?.id?.split('_')?.map(word => word?.charAt(0)?.toUpperCase())?.join('')}
                  </text>
                )}
              </g>
            ))}

            {/* Hover tooltip */}
            {hoveredRegion && (
              <g>
                <rect
                  x={bodyRegions?.find(r => r?.id === hoveredRegion)?.center?.x - 30}
                  y={bodyRegions?.find(r => r?.id === hoveredRegion)?.center?.y - 35}
                  width="60"
                  height="20"
                  fill="#1E293B"
                  fillOpacity="0.9"
                  rx="4"
                />
                <text
                  x={bodyRegions?.find(r => r?.id === hoveredRegion)?.center?.x}
                  y={bodyRegions?.find(r => r?.id === hoveredRegion)?.center?.y - 25}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-white pointer-events-none"
                >
                  {bodyRegions?.find(r => r?.id === hoveredRegion)?.name}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
      {/* Selected regions summary */}
      {selectedRegions?.length > 0 && (
        <div className="mt-4 p-4 bg-error/10 rounded-lg border border-error/20">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              {currentLanguage === 'fa' ? 'نواحی انتخاب شده:' : 'Selected Regions:'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRegions?.map((regionId) => {
              const region = bodyRegions?.find(r => r?.id === regionId);
              return (
                <span
                  key={regionId}
                  className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 bg-error/20 text-error text-xs rounded-full"
                >
                  <span>{region?.name}</span>
                  <button
                    onClick={() => onRegionClick(regionId)}
                    className="hover:bg-error/30 rounded-full p-0.5 transition-clinical"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse text-xs text-muted-foreground">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-3 h-3 bg-border rounded opacity-30"></div>
          <span>{currentLanguage === 'fa' ? 'بدون درد' : 'No Pain'}</span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-3 h-3 bg-error rounded opacity-80"></div>
          <span>{currentLanguage === 'fa' ? 'درد موجود' : 'Pain Present'}</span>
        </div>
      </div>
    </div>
  );
};

export default BodyMapSVG;