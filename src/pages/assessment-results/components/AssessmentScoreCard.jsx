import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentScoreCard = ({ 
  assessment,
  onViewDetails,
  className = '' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const getScoreInterpretation = (score, maxScore, type) => {
    const percentage = (score / maxScore) * 100;
    
    const interpretations = {
      FABQ: {
        low: { threshold: 30, label: currentLanguage === 'fa' ? 'ترس کم' : 'Low Fear', color: 'success' },
        moderate: { threshold: 60, label: currentLanguage === 'fa' ? 'ترس متوسط' : 'Moderate Fear', color: 'warning' },
        high: { threshold: 100, label: currentLanguage === 'fa' ? 'ترس بالا' : 'High Fear', color: 'error' }
      },
      'PHQ-9': {
        low: { threshold: 25, label: currentLanguage === 'fa' ? 'افسردگی خفیف' : 'Mild Depression', color: 'success' },
        moderate: { threshold: 50, label: currentLanguage === 'fa' ? 'افسردگی متوسط' : 'Moderate Depression', color: 'warning' },
        high: { threshold: 100, label: currentLanguage === 'fa' ? 'افسردگی شدید' : 'Severe Depression', color: 'error' }
      },
      PCS: {
        low: { threshold: 30, label: currentLanguage === 'fa' ? 'فاجعه‌سازی کم' : 'Low Catastrophizing', color: 'success' },
        moderate: { threshold: 60, label: currentLanguage === 'fa' ? 'فاجعه‌سازی متوسط' : 'Moderate Catastrophizing', color: 'warning' },
        high: { threshold: 100, label: currentLanguage === 'fa' ? 'فاجعه‌سازی بالا' : 'High Catastrophizing', color: 'error' }
      },
      default: {
        low: { threshold: 33, label: currentLanguage === 'fa' ? 'نمره کم' : 'Low Score', color: 'success' },
        moderate: { threshold: 66, label: currentLanguage === 'fa' ? 'نمره متوسط' : 'Moderate Score', color: 'warning' },
        high: { threshold: 100, label: currentLanguage === 'fa' ? 'نمره بالا' : 'High Score', color: 'error' }
      }
    };

    const typeInterpretations = interpretations?.[type] || interpretations?.default;
    
    if (percentage <= typeInterpretations?.low?.threshold) return typeInterpretations?.low;
    if (percentage <= typeInterpretations?.moderate?.threshold) return typeInterpretations?.moderate;
    return typeInterpretations?.high;
  };

  const interpretation = getScoreInterpretation(assessment?.score, assessment?.maxScore, assessment?.type);
  const percentage = (assessment?.score / assessment?.maxScore) * 100;

  const getAssessmentIcon = (type) => {
    const icons = {
      'FABQ': 'AlertTriangle',
      'PHQ-9': 'Heart',
      'PCS': 'Brain',
      'TSK-11': 'Shield',
      'PSQI': 'Moon',
      'HPLP II': 'Activity',
      'RMDQ': 'User',
      'NRS': 'Gauge',
      'NMQ': 'MapPin',
      'LEFS': 'Zap'
    };
    return icons?.[type] || 'ClipboardList';
  };

  return (
    <div className={`card-clinical p-4 hover:shadow-clinical-md transition-clinical ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={getAssessmentIcon(assessment?.type)} size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-foreground font-heading truncate">
              {assessment?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {assessment?.description}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0"
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {/* Score Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {currentLanguage === 'fa' ? 'نمره' : 'Score'}
          </span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-lg font-bold font-data text-foreground">
              {currentLanguage === 'fa' ? 
                `${assessment?.score}/${assessment?.maxScore}` : 
                `${assessment?.score}/${assessment?.maxScore}`
              }
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              interpretation?.color === 'success' ? 'bg-success/10 text-success' :
              interpretation?.color === 'warning'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
            }`}>
              {interpretation?.label}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              interpretation?.color === 'success' ? 'bg-success' :
              interpretation?.color === 'warning'? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>{currentLanguage === 'fa' ? `٪${Math.round(percentage)}` : `${Math.round(percentage)}%`}</span>
          <span>{assessment?.maxScore}</span>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
          {/* Subscales */}
          {assessment?.subscales && assessment?.subscales?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                {currentLanguage === 'fa' ? 'زیرمقیاس‌ها' : 'Subscales'}
              </h4>
              <div className="space-y-2">
                {assessment?.subscales?.map((subscale, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm text-foreground">{subscale?.name}</span>
                    <span className="text-sm font-data text-muted-foreground">
                      {subscale?.score}/{subscale?.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normal Ranges */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Icon name="Info" size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {currentLanguage === 'fa' ? 'محدوده طبیعی' : 'Normal Range'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {assessment?.normalRange || (currentLanguage === 'fa' ? 'محدوده طبیعی برای این ارزیابی در دسترس نیست': 'Normal range information not available for this assessment'
              )}
            </p>
          </div>

          {/* Clinical Notes */}
          {assessment?.clinicalNotes && (
            <div className="p-3 bg-therapeutic-green/5 rounded-lg border border-therapeutic-green/10">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Icon name="Stethoscope" size={14} className="text-therapeutic-green mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-therapeutic-green">
                    {currentLanguage === 'fa' ? 'یادداشت کلینیکی' : 'Clinical Note'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {assessment?.clinicalNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(assessment)}
              iconName="Eye"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'دانلود' : 'Download'}
            </Button>
          </div>
        </div>
      )}
      {/* Assessment Date */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-muted-foreground">
          <Icon name="Calendar" size={12} />
          <span>
            {currentLanguage === 'fa' ? 
              `تکمیل شده: ${assessment?.completedDate}` : 
              `Completed: ${assessment?.completedDate}`
            }
          </span>
        </div>
        <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>
            {currentLanguage === 'fa' ? 
              `${assessment?.duration} دقیقه` : 
              `${assessment?.duration} min`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentScoreCard;