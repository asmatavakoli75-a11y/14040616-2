import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AdvancedFilters = ({ filters, onFilterChange, currentLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const filterOptions = {
    riskLevel: [
      { value: 'all', label: currentLanguage === 'fa' ? 'همه سطوح' : 'All Levels' },
      { value: 'low', label: currentLanguage === 'fa' ? 'کم (0-39)' : 'Low (0-39)' },
      { value: 'moderate', label: currentLanguage === 'fa' ? 'متوسط (40-69)' : 'Moderate (40-69)' },
      { value: 'high', label: currentLanguage === 'fa' ? 'بالا (70-100)' : 'High (70-100)' }
    ],
    assessmentStatus: [
      { value: 'all', label: currentLanguage === 'fa' ? 'همه وضعیت‌ها' : 'All Statuses' },
      { value: 'active', label: currentLanguage === 'fa' ? 'فعال' : 'Active' },
      { value: 'completed', label: currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed' },
      { value: 'pending', label: currentLanguage === 'fa' ? 'در انتظار' : 'Pending' }
    ],
    demographics: [
      { value: 'all', label: currentLanguage === 'fa' ? 'همه گروه‌ها' : 'All Demographics' },
      { value: 'age_young', label: currentLanguage === 'fa' ? 'جوان (18-35)' : 'Young (18-35)' },
      { value: 'age_middle', label: currentLanguage === 'fa' ? 'میان‌سال (36-55)' : 'Middle-aged (36-55)' },
      { value: 'age_senior', label: currentLanguage === 'fa' ? 'سالمند (55+)' : 'Senior (55+)' },
      { value: 'male', label: currentLanguage === 'fa' ? 'مرد' : 'Male' },
      { value: 'female', label: currentLanguage === 'fa' ? 'زن' : 'Female' }
    ],
    timeRange: [
      { value: '7days', label: currentLanguage === 'fa' ? '7 روز گذشته' : 'Last 7 days' },
      { value: '30days', label: currentLanguage === 'fa' ? '30 روز گذشته' : 'Last 30 days' },
      { value: '3months', label: currentLanguage === 'fa' ? '3 ماه گذشته' : 'Last 3 months' },
      { value: '6months', label: currentLanguage === 'fa' ? '6 ماه گذشته' : 'Last 6 months' },
      { value: '1year', label: currentLanguage === 'fa' ? '1 سال گذشته' : 'Last 1 year' }
    ]
  };

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange?.(localFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      riskLevel: 'all',
      assessmentStatus: 'all',
      demographics: 'all',
      timeRange: '30days'
    };
    setLocalFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters)?.filter(value => value !== 'all')?.length;
  };

  return (
    <div className="card-clinical p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {currentLanguage === 'fa' ? 'فیلترهای پیشرفته' : 'Advanced Filters'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? 
                `${getActiveFilterCount()} فیلتر فعال` : 
                `${getActiveFilterCount()} filters active`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            {isExpanded ? 
              (currentLanguage === 'fa' ? 'بستن' : 'Collapse') :
              (currentLanguage === 'fa' ? 'باز کردن' : 'Expand')
            }
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Risk Level Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                {currentLanguage === 'fa' ? 'سطح ریسک' : 'Risk Level'}
              </label>
              <Select
                value={localFilters?.riskLevel}
                onValueChange={(value) => handleFilterUpdate('riskLevel', value)}
                options={filterOptions?.riskLevel}
                placeholder={currentLanguage === 'fa' ? 'انتخاب سطح ریسک' : 'Select risk level'}
              />
            </div>

            {/* Assessment Status Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                {currentLanguage === 'fa' ? 'وضعیت ارزیابی' : 'Assessment Status'}
              </label>
              <Select
                value={localFilters?.assessmentStatus}
                onValueChange={(value) => handleFilterUpdate('assessmentStatus', value)}
                options={filterOptions?.assessmentStatus}
                placeholder={currentLanguage === 'fa' ? 'انتخاب وضعیت' : 'Select status'}
              />
            </div>

            {/* Demographics Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                {currentLanguage === 'fa' ? 'جمعیت‌شناسی' : 'Demographics'}
              </label>
              <Select
                value={localFilters?.demographics}
                onValueChange={(value) => handleFilterUpdate('demographics', value)}
                options={filterOptions?.demographics}
                placeholder={currentLanguage === 'fa' ? 'انتخاب گروه' : 'Select demographic'}
              />
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                {currentLanguage === 'fa' ? 'بازه زمانی' : 'Time Range'}
              </label>
              <Select
                value={localFilters?.timeRange}
                onValueChange={(value) => handleFilterUpdate('timeRange', value)}
                options={filterOptions?.timeRange}
                placeholder={currentLanguage === 'fa' ? 'انتخاب بازه' : 'Select range'}
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="Info" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {currentLanguage === 'fa' ? 'فیلترها بر روی تمام نمودارها و جداول اعمال می‌شوند': 'Filters apply to all charts and tables'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                iconName="X"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'پاک کردن' : 'Clear All'}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={applyFilters}
                iconName="Check"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'اعمال فیلترها' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;