import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendAnalysis = ({ currentLanguage }) => {
  const [selectedMetric, setSelectedMetric] = useState('pain');
  const [chartType, setChartType] = useState('line');

  const trendData = [
    {
      date: '2024-12-05',
      phase: 'T0',
      pain: 8,
      disability: 14,
      depression: 12,
      kinesiophobia: 32,
      catastrophizing: 28,
      chronicRisk: 75
    },
    {
      date: '2025-01-05',
      phase: 'T1',
      pain: 6,
      disability: 10,
      depression: 8,
      kinesiophobia: 28,
      catastrophizing: 22,
      chronicRisk: 65
    },
    {
      date: '2025-03-05',
      phase: 'T2',
      pain: 4,
      disability: 6,
      depression: 5,
      kinesiophobia: 24,
      catastrophizing: 18,
      chronicRisk: 45
    }
  ];

  const metrics = [
    {
      id: 'pain',
      name: currentLanguage === 'fa' ? 'شدت درد' : 'Pain Intensity',
      color: '#DC2626',
      icon: 'Zap'
    },
    {
      id: 'disability',
      name: currentLanguage === 'fa' ? 'ناتوانی عملکردی' : 'Functional Disability',
      color: '#F59E0B',
      icon: 'Activity'
    },
    {
      id: 'depression',
      name: currentLanguage === 'fa' ? 'افسردگی' : 'Depression',
      color: '#7C3AED',
      icon: 'Brain'
    },
    {
      id: 'chronicRisk',
      name: currentLanguage === 'fa' ? 'ریسک مزمن' : 'Chronic Risk',
      color: '#059669',
      icon: 'TrendingUp'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-clinical">
          <p className="text-sm font-medium text-foreground mb-2">
            {data?.phase} - {data?.date}
          </p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${entry?.dataKey === 'chronicRisk' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getMetricChange = (metric) => {
    const initial = trendData?.[0]?.[metric];
    const latest = trendData?.[trendData?.length - 1]?.[metric];
    const change = ((latest - initial) / initial) * 100;
    return {
      value: Math.abs(change)?.toFixed(1),
      direction: change < 0 ? 'down' : 'up',
      isImprovement: (metric === 'chronicRisk' || metric === 'pain' || metric === 'disability' || metric === 'depression') ? change < 0 : change > 0
    };
  };

  return (
    <div className="card-clinical p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading mb-4 sm:mb-0">
          {currentLanguage === 'fa' ? 'تحلیل روند' : 'Trend Analysis'}
        </h2>
        
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            iconName="TrendingUp"
          >
            {currentLanguage === 'fa' ? 'خطی' : 'Line'}
          </Button>
          
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            iconName="BarChart3"
          >
            {currentLanguage === 'fa' ? 'ستونی' : 'Bar'}
          </Button>
        </div>
      </div>
      {/* Metric Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics?.map((metric) => {
          const change = getMetricChange(metric?.id);
          const isSelected = selectedMetric === metric?.id;
          
          return (
            <button
              key={metric?.id}
              onClick={() => setSelectedMetric(metric?.id)}
              className={`p-4 rounded-lg border transition-clinical text-left rtl:text-right ${
                isSelected 
                  ? 'border-primary bg-primary/10' :'border-border bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <Icon 
                  name={metric?.icon} 
                  size={16} 
                  style={{ color: isSelected ? metric?.color : 'currentColor' }}
                />
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {metric?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-lg font-bold font-data" style={{ color: metric?.color }}>
                  {trendData?.[trendData?.length - 1]?.[metric?.id]}
                  {metric?.id === 'chronicRisk' ? '%' : ''}
                </span>
                
                <div className={`flex items-center space-x-1 rtl:space-x-reverse text-xs ${
                  change?.isImprovement ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={change?.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                  />
                  <span>{change?.value}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="phase" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={metrics?.find(m => m?.id === selectedMetric)?.color}
                strokeWidth={3}
                dot={{ fill: metrics?.find(m => m?.id === selectedMetric)?.color, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: metrics?.find(m => m?.id === selectedMetric)?.color }}
              />
            </LineChart>
          ) : (
            <BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="phase" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={selectedMetric}
                fill={metrics?.find(m => m?.id === selectedMetric)?.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Insights */}
      <div className="mt-6 p-4 bg-therapeutic-green/10 rounded-lg border border-therapeutic-green/20">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon name="Lightbulb" size={20} className="text-therapeutic-green flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-therapeutic-green mb-1">
              {currentLanguage === 'fa' ? 'بینش کلینیکی' : 'Clinical Insights'}
            </h4>
            <p className="text-sm text-foreground">
              {currentLanguage === 'fa' ?'بیمار پیشرفت قابل توجهی در کاهش درد و بهبود عملکرد نشان داده است. ریسک مزمن شدن از ۷۵٪ به ۴۵٪ کاهش یافته که نشان‌دهنده پاسخ مثبت به درمان است.' :'Patient shows significant improvement in pain reduction and functional recovery. Chronic risk decreased from 75% to 45%, indicating positive treatment response.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;