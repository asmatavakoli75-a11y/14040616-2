import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsCards = ({ metrics, currentLanguage }) => {
  const metricCards = [
    {
      title: currentLanguage === 'fa' ? 'کل بیماران' : 'Total Patients',
      value: metrics?.totalPatients?.toLocaleString() || '0',
      icon: 'Users',
      color: 'blue',
      change: '+12%',
      changeType: 'positive',
      description: currentLanguage === 'fa' ? 'در ماه گذشته' : 'from last month'
    },
    {
      title: currentLanguage === 'fa' ? 'نرخ تکمیل ارزیابی' : 'Assessment Completion',
      value: `${metrics?.completionRate || 0}%`,
      icon: 'CheckCircle',
      color: 'green',
      change: '+5.2%',
      changeType: 'positive',
      description: currentLanguage === 'fa' ? 'بهبود عملکرد' : 'improved performance'
    },
    {
      title: currentLanguage === 'fa' ? 'توزیع ریسک بالا' : 'High Risk Distribution',
      value: `${metrics?.riskDistribution?.high || 0}%`,
      icon: 'AlertTriangle',
      color: 'red',
      change: '-2.1%',
      changeType: 'positive',
      description: currentLanguage === 'fa' ? 'کاهش موارد پرخطر' : 'reduced high-risk cases'
    },
    {
      title: currentLanguage === 'fa' ? 'دقت مدل' : 'Model Accuracy',
      value: `${metrics?.modelAccuracy || 0}%`,
      icon: 'Target',
      color: 'purple',
      change: '+1.3%',
      changeType: 'positive',
      description: currentLanguage === 'fa' ? 'بهبود پیش‌بینی' : 'prediction improvement'
    }
  ];

  const getCardColorClass = (color) => {
    const colorMap = {
      blue: 'border-l-4 border-l-blue-500 bg-blue-50/50',
      green: 'border-l-4 border-l-green-500 bg-green-50/50',
      red: 'border-l-4 border-l-red-500 bg-red-50/50',
      purple: 'border-l-4 border-l-purple-500 bg-purple-50/50'
    };
    return colorMap?.[color] || colorMap?.blue;
  };

  const getIconColorClass = (color) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      purple: 'text-purple-600'
    };
    return colorMap?.[color] || colorMap?.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metricCards?.map((card, index) => (
        <div 
          key={index}
          className={`card-clinical p-6 hover:shadow-clinical-md transition-clinical ${getCardColorClass(card?.color)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm`}>
              <Icon 
                name={card?.icon} 
                size={20} 
                className={getIconColorClass(card?.color)}
              />
            </div>
            <div className={`flex items-center space-x-1 rtl:space-x-reverse text-xs font-medium ${
              card?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon 
                name={card?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
              />
              <span>{card?.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground font-caption">
              {card?.title}
            </h3>
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              <span className="text-2xl font-bold text-foreground font-heading">
                {card?.value}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {card?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetricsCards;