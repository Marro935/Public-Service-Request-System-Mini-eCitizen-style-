import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { initializeStorage, checkBackendHealth } from './services/storageService';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickLoginBar from './components/QuickLoginBar';
import ToastContainer from './components/ToastContainer';
import AuthModal from './components/AuthModal';

// Views
import HomeView from './pages/HomeView';
import SubmitRequestView from './pages/SubmitRequestView';
import TrackRequestView from './pages/TrackRequestView';
import CitizenDashboardView from './pages/CitizenDashboardView';
import AdminDashboardView from './pages/AdminDashboardView';
import AnalyticsView from './pages/AnalyticsView';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState('EC-2026-1042');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeStorage();
    checkBackendHealth();
  }, []);

  const handleSelectTracking = (trackingId) => {
    setActiveTrackingNumber(trackingId);
    setCurrentView('track');
  };

  const handleResetData = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-container" key={refreshKey}>
      {/* 1-Click Persona Switcher for Evaluator Convenience */}
      <QuickLoginBar onDataReset={handleResetData} />

      {/* Official Government Navbar */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        onOpenLogin={() => setIsAuthModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {currentView === 'home' && (
          <HomeView
            setView={setCurrentView}
            onSelectTracking={handleSelectTracking}
          />
        )}

        {currentView === 'submit' && (
          <SubmitRequestView
            setView={setCurrentView}
            onSelectTracking={handleSelectTracking}
          />
        )}

        {currentView === 'track' && (
          <TrackRequestView
            trackingNumber={activeTrackingNumber}
            setView={setCurrentView}
          />
        )}

        {currentView === 'citizen_dashboard' && (
          <CitizenDashboardView
            setView={setCurrentView}
            onSelectTracking={handleSelectTracking}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            setView={setCurrentView}
            onSelectTracking={handleSelectTracking}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            setView={setCurrentView}
          />
        )}
      </main>

      {/* Official Civic Footer */}
      <Footer setView={setCurrentView} />

      {/* Floating System Toasts */}
      <ToastContainer />

      {/* Sign In & Citizen Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
