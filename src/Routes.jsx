import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientRegistration from './pages/patient-registration';
import AssessmentResults from './pages/assessment-results';
import PatientProfile from './pages/patient-profile';
import PatientLogin from './pages/patient-login';
import MultiStepAssessment from './pages/multi-step-assessment';
import AdminDashboard from './pages/admin-dashboard';
import Installer from './pages/installer';

const AppRoutes = () => {
  const [isInstalled, setIsInstalled] = useState(true); // Assume installed initially to prevent flash
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await axios.get('/api/status');
        setIsInstalled(data.installed);
        if (!data.installed && location.pathname !== '/installer') {
          navigate('/installer', { replace: true });
        }
      } catch (error) {
        // If the status endpoint fails, it might be because the server isn't running
        // the main app yet. We can assume it's not installed.
        console.error('Could not fetch app status, assuming not installed.', error);
        setIsInstalled(false);
        if (location.pathname !== '/installer') {
          navigate('/installer', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/installer" element={<Installer />} />
        {isInstalled ? (
          <>
            <Route path="/" element={<PatientLogin />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            <Route path="/assessment-results" element={<AssessmentResults />} />
            <Route path="/patient-profile/:patientId" element={<PatientProfile />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/multi-step-assessment/:questionnaireId" element={<MultiStepAssessment />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </>
        ) : (
          // If not installed, all other paths could lead to a "not found" or back to installer
          <Route path="*" element={<Installer />} />
        )}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
}

const Routes = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Routes;