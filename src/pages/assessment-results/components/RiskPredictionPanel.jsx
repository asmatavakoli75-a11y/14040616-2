import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RiskPredictionPanel = ({ 
  riskPercentage = 72, 
  confidenceInterval = [65, 79], 
  riskLevel = 'high',
  shapValues = [],
  onViewDetails,
  className = '' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [riskPercentage]);

  const getRiskLevelConfig = () => {
    const configs = {
      low: {
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        label: currentLanguage === 'fa' ? 'خطر کم' : 'Low Risk',
        description: currentLanguage === 'fa' ?'احتمال کم ابتلا به درد مزمن کمر' :'Low probability of chronic back pain development'
      },
      moderate: {
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        label: currentLanguage === 'fa' ? 'خطر متوسط' : 'Moderate Risk',
        description: currentLanguage === 'fa' ?'احتمال متوسط ابتلا به درد مزمن کمر' :'Moderate probability of chronic back pain development'
      },
      high: {
        color: 'text-error',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        label: currentLanguage === 'fa' ? 'خطر بالا' : 'High Risk',
        description: currentLanguage === 'fa' ?'احتمال بالای ابتلا به درد مزمن کمر' :'High probability of chronic back pain development'
      }
    };
    return configs?.[riskLevel] || configs?.moderate;
  };

  const config = getRiskLevelConfig();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (riskPercentage / 100) * circumference;

  const topFactors = shapValues?.slice(0, 5);

  return (
    <div className={`card-clinical-elevated p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'پیش‌بینی خطر مزمن شدن' : 'Chronicity Risk Prediction'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 'تحلیل هوش مصنوعی' : 'AI-Powered Analysis'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          iconName="Info"
          iconPosition="left"
        >
          {currentLanguage === 'fa' ? 'جزئیات' : 'Details'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={isAnimating ? circumference : strokeDashoffset}
                className={`${config?.color} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold font-data ${config?.color}`}>
                {currentLanguage === 'fa' ? `٪${riskPercentage}` : `${riskPercentage}%`}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {currentLanguage === 'fa' ? 'احتمال' : 'Risk'}
              </span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-full ${config?.bgColor} ${config?.borderColor} border`}>
            <span className={`text-sm font-medium ${config?.color}`}>
              {config?.label}
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
            {config?.description}
          </p>

          {/* Confidence Interval */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg w-full max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {currentLanguage === 'fa' ? 'فاصله اطمینان ۹۵٪' : '95% Confidence Interval'}
              </span>
              <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-data text-foreground">
                {currentLanguage === 'fa' ? `٪${confidenceInterval?.[0]}` : `${confidenceInterval?.[0]}%`}
              </span>
              <div className="flex-1 h-1 bg-border rounded-full mx-2">
                <div 
                  className={`h-full rounded-full ${config?.color?.replace('text-', 'bg-')}`}
                  style={{ 
                    width: `${((confidenceInterval?.[1] - confidenceInterval?.[0]) / 100) * 100}%`,
                    marginLeft: `${(confidenceInterval?.[0] / 100) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm font-data text-foreground">
                {currentLanguage === 'fa' ? `٪${confidenceInterval?.[1]}` : `${confidenceInterval?.[1]}%`}
              </span>
            </div>
          </div>
        </div>

        {/* SHAP Values */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <Icon name="BarChart3" size={18} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground font-heading">
              {currentLanguage === 'fa' ? 'عوامل تأثیرگذار' : 'Contributing Factors'}
            </h3>
          </div>

          <div className="space-y-3">
            {topFactors?.map((factor, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {factor?.name}
                  </span>
                  <span className={`text-sm font-data ${
                    factor?.impact > 0 ? 'text-error' : 'text-success'
                  }`}>
                    {factor?.impact > 0 ? '+' : ''}{factor?.impact?.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      factor?.impact > 0 ? 'bg-error' : 'bg-success'
                    }`}
                    style={{ 
                      width: `${Math.abs(factor?.impact) * 10}%`,
                      marginLeft: factor?.impact < 0 ? `${100 - Math.abs(factor?.impact) * 10}%` : '0'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {factor?.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  {currentLanguage === 'fa' ? 'توصیه کلینیکی' : 'Clinical Recommendation'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentLanguage === 'fa' ?'بر اساس نتایج، مراجعه به متخصص ارتوپدی و شروع فیزیوتراپی توصیه می‌شود.' :'Based on results, consultation with orthopedic specialist and physiotherapy initiation is recommended.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Model Information */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span>
              {currentLanguage === 'fa' ? 'مدل: CLBP-ML v2.1' : 'Model: CLBP-ML v2.1'}
            </span>
            <span>
              {currentLanguage === 'fa' ? 'دقت: ۸۷٪' : 'Accuracy: 87%'}
            </span>
          </div>
          <span>
            {currentLanguage === 'fa' 
              ? `تحلیل شده در: ${new Date()?.toLocaleDateString('fa-IR')}`
              : `Analyzed on: ${new Date()?.toLocaleDateString()}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskPredictionPanel;