import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const DataVisualizationPanels = ({ data, currentLanguage, compact = false }) => {
  // Mock data for charts
  const riskDistributionData = [
    { 
      name: currentLanguage === 'fa' ? 'کم' : 'Low',
      value: data?.riskDistribution?.low || 45.2,
      color: '#10B981'
    },
    { 
      name: currentLanguage === 'fa' ? 'متوسط' : 'Moderate',
      value: data?.riskDistribution?.moderate || 38.7,
      color: '#F59E0B'
    },
    { 
      name: currentLanguage === 'fa' ? 'بالا' : 'High',
      value: data?.riskDistribution?.high || 16.1,
      color: '#DC2626'
    }
  ];

  const trendData = [
    { 
      month: currentLanguage === 'fa' ? 'فرو' : 'Jan',
      patients: 98,
      completed: 82,
      accuracy: 92.1
    },
    { 
      month: currentLanguage === 'fa' ? 'اسف' : 'Feb',
      patients: 112,
      completed: 95,
      accuracy: 93.4
    },
    { 
      month: currentLanguage === 'fa' ? 'فار' : 'Mar',
      patients: 125,
      completed: 108,
      accuracy: 94.2
    },
    { 
      month: currentLanguage === 'fa' ? 'ارد' : 'Apr',
      patients: 134,
      completed: 116,
      accuracy: 94.7
    }
  ];

  const scoreCorrelationData = [
    { age: '20-30', avgScore: 35, count: 145 },
    { age: '31-40', avgScore: 52, count: 298 },
    { age: '41-50', avgScore: 68, count: 387 },
    { age: '51-60', avgScore: 74, count: 265 },
    { age: '60+', avgScore: 69, count: 152 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-clinical-md">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${typeof entry?.value === 'number' && entry?.value < 100 ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <div className="card-clinical p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            {currentLanguage === 'fa' ? 'توزیع ریسک' : 'Risk Distribution'}
          </h3>
          <Icon name="PieChart" size={20} className="text-muted-foreground" />
        </div>
        
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistributionData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {riskDistributionData?.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{item?.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Risk Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'توزیع امتیاز ریسک' : 'Risk Score Distribution'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 'تحلیل سطوح ریسک بیماران' : 'Analysis of patient risk levels'}
              </p>
            </div>
            <Icon name="PieChart" size={24} className="text-muted-foreground" />
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {riskDistributionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Series Trend */}
        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'روند زمانی' : 'Time Series Trend'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 'تحلیل روند ماهانه' : 'Monthly trend analysis'}
              </p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-muted-foreground" />
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  name={currentLanguage === 'fa' ? 'بیماران' : 'Patients'}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Score Correlation Analysis */}
      <div className="card-clinical p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'تحلیل همبستگی امتیاز' : 'Score Correlation Analysis'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 'رابطه بین سن و امتیاز ریسک' : 'Relationship between age and risk score'}
            </p>
          </div>
          <Icon name="BarChart3" size={24} className="text-muted-foreground" />
        </div>
        
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={scoreCorrelationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="age" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                label={{ 
                  value: currentLanguage === 'fa' ? 'میانگین امتیاز' : 'Average Score', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgScore" 
                fill="#2563EB"
                name={currentLanguage === 'fa' ? 'میانگین امتیاز' : 'Average Score'}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Users" size={20} className="text-blue-600" />
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {currentLanguage === 'fa' ? 'گروه جدید' : 'New Cohort'}
            </span>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'بیماران T1' : 'T1 Phase Patients'}
            </h4>
            <p className="text-2xl font-bold text-foreground">487</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+12% این ماه' : '+12% this month'}
            </p>
          </div>
        </div>

        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Activity" size={20} className="text-green-600" />
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {currentLanguage === 'fa' ? 'فعال' : 'Active'}
            </span>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'بیماران T2' : 'T2 Phase Patients'}
            </h4>
            <p className="text-2xl font-bold text-foreground">312</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+8% این ماه' : '+8% this month'}
            </p>
          </div>
        </div>

        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-4">
            <Icon name="CheckCircle" size={20} className="text-purple-600" />
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {currentLanguage === 'fa' ? 'تکمیل' : 'Complete'}
            </span>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'بیماران T3' : 'T3 Phase Patients'}
            </h4>
            <p className="text-2xl font-bold text-foreground">198</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+15% این ماه' : '+15% this month'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationPanels;