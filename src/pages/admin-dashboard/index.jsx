import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../components/ui/LanguageToggle';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PerformanceMetricsCards from './components/PerformanceMetricsCards';
import PatientOverviewTable from './components/PatientOverviewTable';
import DataVisualizationPanels from './components/DataVisualizationPanels';
import ModelPerformanceMonitoring from './components/ModelPerformanceMonitoring';
import ModelTrainingPanel from './components/ModelTrainingPanel';
import UnivariateAnalysisPanel from './components/UnivariateAnalysisPanel';
import AdminToolbar from './components/AdminToolbar';
import AdvancedFilters from './components/AdvancedFilters';
import SettingsPanel from './components/SettingsPanel';
import QuestionnaireManager from './components/QuestionnaireManager'; // Import the new component

const AdminDashboard = () => {
  const currentLanguage = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    assessmentStatus: 'all',
    demographics: 'all',
    timeRange: '30days'
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { list: users, status: userStatus, error: userError } = useSelector((state) => state.users);

  useEffect(() => {
    if (activeView === 'patients') {
      dispatch(fetchUsers());
    }
  }, [dispatch, activeView]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const metricsRes = await axios.get('/api/dashboard/metrics');
        const recentPatientsRes = await axios.get('/api/dashboard/recent-patients');
        setMetrics(metricsRes.data);
        setRecentPatients(recentPatientsRes.data);
      } catch (error) {
        addToast('Failed to load dashboard data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeView === 'overview') {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [activeView, addToast]);

  const viewTabs = [
    { id: 'overview', name: currentLanguage === 'fa' ? 'نمای کلی' : 'Overview', icon: 'LayoutDashboard' },
    { id: 'patients', name: currentLanguage === 'fa' ? 'مدیریت بیماران' : 'Patient Management', icon: 'Users' },
    { id: 'questionnaires', name: currentLanguage === 'fa' ? 'پرسشنامه‌ها' : 'Questionnaires', icon: 'FileText' },
    { id: 'analytics', name: currentLanguage === 'fa' ? 'تجزیه و تحلیل' : 'Analytics', icon: 'BarChart3' },
    { id: 'analysis', name: currentLanguage === 'fa' ? 'تحلیل داده' : 'Data Analysis', icon: 'BarChart2' },
    { id: 'monitoring', name: currentLanguage === 'fa' ? 'نظارت بر مدل' : 'Model Monitoring', icon: 'Activity' },
    { id: 'settings', name: currentLanguage === 'fa' ? 'تنظیمات' : 'Settings', icon: 'Settings' }
  ];

  const handlePatientClick = (patientId) => {
    navigate(`/patient-profile/${patientId}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const sourceData = activeView === 'overview' ? recentPatients : users;
    const filtered = sourceData.filter(patient => {
      if (newFilters?.assessmentStatus !== 'all' && patient.status !== newFilters.assessmentStatus) {
        return false;
      }
      return true;
    });
    setFilteredPatients(filtered);
  };

  const handleExportData = (format) => {
    if (format === 'csv') {
      window.location.href = '/api/assessments/export';
      addToast('Exporting assessments as CSV...', 'info');
    } else {
      addToast(`${format.toUpperCase()} export is not implemented yet.`, 'warning');
    }
  };

  const handleDownloadDetailedReport = async () => {
    try {
      const response = await axios.get('/api/reports/detailed-data', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'detailed_report.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      addToast(currentLanguage === 'fa' ? 'خطا در دانلود گزارش.' : 'Failed to download report.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner text={currentLanguage === 'fa' ? 'در حال بارگذاری داشبورد...' : 'Loading dashboard...'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16 rtl:mr-16 rtl:ml-0' : 'ml-64 rtl:mr-64 rtl:ml-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4 lg:mb-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground font-heading">
                    {currentLanguage === 'fa' ? 'داشبورد مدیریت' : 'Admin Dashboard'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {currentLanguage === 'fa' ? 'نظارت و مدیریت جامع سیستم ارزیابی درد کمر مزمن': 'Comprehensive chronic low back pain assessment management and oversight'}
                  </p>
                </div>
              </div>
              <AdminToolbar onExport={handleExportData} currentLanguage={currentLanguage} />
            </div>

            <div className="card-clinical p-2 mb-6">
              <div className="flex items-center space-x-1 rtl:space-x-reverse overflow-x-auto">
                {viewTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-clinical whitespace-nowrap ${
                      activeView === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in">
              {activeView === 'overview' && (
                <div className="space-y-8">
                  <PerformanceMetricsCards metrics={metrics} currentLanguage={currentLanguage} />
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                      <PatientOverviewTable patients={recentPatients} onPatientClick={handlePatientClick} currentLanguage={currentLanguage} compact={true} />
                    </div>
                    <div>
                      <DataVisualizationPanels data={metrics} currentLanguage={currentLanguage} compact={true} />
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'patients' && (
                <div className="space-y-6">
                  <AdvancedFilters filters={filters} onFilterChange={handleFilterChange} currentLanguage={currentLanguage} />
                  {userStatus === 'loading' && <LoadingSpinner text="Loading patients..." size="sm" />}
                  {userError && (
                    <div className="text-destructive text-center py-4">
                      <p>{currentLanguage === 'fa' ? 'خطا در بارگذاری بیماران.' : 'Error loading patients.'}</p>
                      <p className="text-xs">{userError.message || 'Unknown error'}</p>
                    </div>
                  )}
                  {userStatus === 'succeeded' && (
                    <PatientOverviewTable patients={filteredPatients?.length > 0 ? filteredPatients : users} onPatientClick={handlePatientClick} currentLanguage={currentLanguage} />
                  )}
                </div>
              )}

              {activeView === 'questionnaires' && (
                <QuestionnaireManager currentLanguage={currentLanguage} />
              )}

              {activeView === 'analytics' && (
                <DataVisualizationPanels data={metrics} currentLanguage={currentLanguage} />
              )}

              {activeView === 'analysis' && (
                <div className="space-y-8">
                  <ModelTrainingPanel currentLanguage={currentLanguage} />
                  <div className="my-8 border-b border-border"></div>
                  <UnivariateAnalysisPanel currentLanguage={currentLanguage} />
                </div>
              )}

              {activeView === 'monitoring' && (
                <ModelPerformanceMonitoring performance={metrics} currentLanguage={currentLanguage} />
              )}

              {activeView === 'settings' && (
                <SettingsPanel currentLanguage={currentLanguage} />
              )}
            </div>

            <div className="mt-12 p-6 bg-muted/30 rounded-lg border">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentLanguage === 'fa' ? 
                      `آخرین به‌روزرسانی: ${new Date()?.toLocaleDateString('fa-IR')} - ${new Date()?.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}` :
                      `Last updated: ${new Date()?.toLocaleDateString()} at ${new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    }
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => navigate('/patient-registration')} iconName="UserPlus" iconPosition="left">
                    {currentLanguage === 'fa' ? 'ثبت بیمار جدید' : 'Add New Patient'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadDetailedReport} iconName="FileText" iconPosition="left">
                    {currentLanguage === 'fa' ? 'گزارشات تفصیلی' : 'Detailed Reports'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveView('settings')} iconName="Settings" iconPosition="left">
                    {currentLanguage === 'fa' ? 'تنظیمات' : 'Settings'}
                  </Button>
                  <Button variant="default" size="sm" onClick={() => window.location?.reload()} iconName="RefreshCw" iconPosition="left">
                    {currentLanguage === 'fa' ? 'به‌روزرسانی' : 'Refresh'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;