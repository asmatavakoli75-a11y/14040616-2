import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../components/ui/LanguageToggle';

const TrendAnalysisChart = ({ 
  timePointData = [], 
  selectedMetrics = ['riskScore', 'painLevel'],
  onMetricToggle,
  className = '' 
}) => {
  const currentLanguage = useLanguage();
  const [chartType, setChartType] = useState('line');
  const [showPrediction, setShowPrediction] = useState(true);

  // Mock trend data with predictions
  const mockTrendData = [
    {
      timePoint: 'T0',
      date: '2024-06-05',
      riskScore: 72,
      painLevel: 6.5,
      functionalScore: 45,
      qualityOfLife: 3.2,
      label: currentLanguage === 'fa' ? 'ارزیابی اولیه' : 'Initial Assessment'
    },
    {
      timePoint: 'T1',
      date: '2024-07-05',
      riskScore: 68,
      painLevel: 5.8,
      functionalScore: 52,
      qualityOfLife: 3.8,
      label: currentLanguage === 'fa' ? 'یک ماه بعد' : '1 Month Follow-up'
    },
    {
      timePoint: 'T2',
      date: '2024-09-05',
      riskScore: 65,
      painLevel: 5.2,
      functionalScore: 58,
      qualityOfLife: 4.1,
      label: currentLanguage === 'fa' ? 'سه ماه بعد' : '3 Month Follow-up'
    },
    // Predicted future points
    {
      timePoint: 'T3',
      date: '2024-12-05',
      riskScore: 62,
      painLevel: 4.8,
      functionalScore: 63,
      qualityOfLife: 4.5,
      label: currentLanguage === 'fa' ? 'پیش‌بینی ۶ ماه' : '6 Month Prediction',
      isPredicted: true
    },
    {
      timePoint: 'T4',
      date: '2025-03-05',
      riskScore: 58,
      painLevel: 4.2,
      functionalScore: 68,
      qualityOfLife: 4.8,
      label: currentLanguage === 'fa' ? 'پیش‌بینی ۹ ماه' : '9 Month Prediction',
      isPredicted: true
    }
  ];

  const availableMetrics = [
    {
      key: 'riskScore',
      name: currentLanguage === 'fa' ? 'نمره خطر' : 'Risk Score',
      color: '#DC2626',
      unit: '%'
    },
    {
      key: 'painLevel',
      name: currentLanguage === 'fa' ? 'سطح درد' : 'Pain Level',
      color: '#F59E0B',
      unit: '/10'
    },
    {
      key: 'functionalScore',
      name: currentLanguage === 'fa' ? 'نمره عملکردی' : 'Functional Score',
      color: '#10B981',
      unit: '/100'
    },
    {
      key: 'qualityOfLife',
      name: currentLanguage === 'fa' ? 'کیفیت زندگی' : 'Quality of Life',
      color: '#2563EB',
      unit: '/5'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-clinical-md p-3">
          <p className="text-sm font-medium text-foreground mb-2">
            {data?.label}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {new Date(data.date)?.toLocaleDateString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US')}
          </p>
          {payload?.map((entry, index) => {
            const metric = availableMetrics?.find(m => m?.key === entry?.dataKey);
            return (
              <div key={index} className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry?.color }}
                  />
                  <span className="text-xs text-foreground">{metric?.name}</span>
                </div>
                <span className="text-xs font-data text-foreground">
                  {entry?.value}{metric?.unit}
                </span>
              </div>
            );
          })}
          {data?.isPredicted && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground italic">
                {currentLanguage === 'fa' ? 'پیش‌بینی شده' : 'Predicted'}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={mockTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="timePoint" 
            stroke="#64748B"
            fontSize={12}
          />
          <YAxis stroke="#64748B" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {selectedMetrics?.map((metricKey) => {
            const metric = availableMetrics?.find(m => m?.key === metricKey);
            if (!metric) return null;
            
            if (chartType === 'area') {
              return (
                <Area
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={metric?.color}
                  fill={metric?.color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name={metric?.name}
                  connectNulls={false}
                  strokeDasharray={(data) => data?.isPredicted ? "5 5" : "0"}
                />
              );
            }
            
            return (
              <Line
                key={metricKey}
                type="monotone"
                dataKey={metricKey}
                stroke={metric?.color}
                strokeWidth={2}
                name={metric?.name}
                connectNulls={false}
                strokeDasharray="0"
                dot={{ fill: metric?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: metric?.color, strokeWidth: 2 }}
              />
            );
          })}
          
          {/* Prediction line separator */}
          {showPrediction && (
            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="#94A3B8"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              activeDot={false}
              connectNulls={false}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  const getTrendDirection = (metricKey) => {
    const values = mockTrendData?.filter(d => !d?.isPredicted)?.map(d => d?.[metricKey]);
    if (values?.length < 2) return 'stable';
    
    const firstValue = values?.[0];
    const lastValue = values?.[values?.length - 1];
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'improving': return 'TrendingUp';
      case 'declining': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (direction, metricKey) => {
    // For risk score, declining is good (green), improving is bad (red)
    if (metricKey === 'riskScore') {
      switch (direction) {
        case 'improving': return 'text-error';
        case 'declining': return 'text-success';
        default: return 'text-muted-foreground';
      }
    }
    // For other metrics, improving is good
    switch (direction) {
      case 'improving': return 'text-success';
      case 'declining': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={`card-clinical-elevated p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'تحلیل روند زمانی' : 'Trend Analysis'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 'پیگیری پیشرفت در طول زمان' : 'Progress tracking over time'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            iconName="Activity"
            iconPosition="left"
          >
            {currentLanguage === 'fa' ? 'خطی' : 'Line'}
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
            iconName="AreaChart"
            iconPosition="left"
          >
            {currentLanguage === 'fa' ? 'ناحیه‌ای' : 'Area'}
          </Button>
        </div>
      </div>
      {/* Metric Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">
          {currentLanguage === 'fa' ? 'انتخاب معیارها' : 'Select Metrics'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableMetrics?.map((metric) => (
            <button
              key={metric?.key}
              onClick={() => onMetricToggle && onMetricToggle(metric?.key)}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-clinical ${
                selectedMetrics?.includes(metric?.key)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: metric?.color }}
              />
              <span>{metric?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="mb-6">
        {renderChart()}
      </div>
      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {selectedMetrics?.map((metricKey) => {
          const metric = availableMetrics?.find(m => m?.key === metricKey);
          const direction = getTrendDirection(metricKey);
          const currentValue = mockTrendData?.find(d => d?.timePoint === 'T2')?.[metricKey] || 0;
          const previousValue = mockTrendData?.find(d => d?.timePoint === 'T0')?.[metricKey] || 0;
          const change = currentValue - previousValue;
          
          return (
            <div key={metricKey} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {metric?.name}
                </span>
                <Icon 
                  name={getTrendIcon(direction)} 
                  size={16} 
                  className={getTrendColor(direction, metricKey)}
                />
              </div>
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-lg font-bold font-data text-foreground">
                  {currentValue}{metric?.unit}
                </span>
                <span className={`text-sm font-data ${getTrendColor(direction, metricKey)}`}>
                  {change > 0 ? '+' : ''}{change?.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentLanguage === 'fa' ? 'از ارزیابی اولیه' : 'from baseline'}
              </p>
            </div>
          );
        })}
      </div>
      {/* Prediction Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setShowPrediction(!showPrediction)}
            className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground hover:text-foreground transition-clinical"
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
              showPrediction ? 'bg-primary border-primary' : 'border-border'
            }`}>
              {showPrediction && <Icon name="Check" size={12} color="white" />}
            </div>
            <span>
              {currentLanguage === 'fa' ? 'نمایش پیش‌بینی‌ها' : 'Show Predictions'}
            </span>
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {currentLanguage === 'fa' ?'آخرین به‌روزرسانی: امروز'
            : `Last updated: ${new Date()?.toLocaleDateString()}`
          }
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisChart;