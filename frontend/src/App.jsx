import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyModal } from './components/EmergencyModal';
import { DesignThinkingModal } from './components/DesignThinkingModal';
import { ChatbotWidget } from './components/ChatbotWidget';

import { HomePage } from './pages/HomePage';
import { AssessmentHubPage } from './pages/AssessmentHubPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisReportPage } from './pages/AnalysisReportPage';
import { DisordersPage } from './pages/DisordersPage';
import { LifestyleTrackerPage } from './pages/LifestyleTrackerPage';
import { DoctorConsultationPage } from './pages/DoctorConsultationPage';

export function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedTestKey, setSelectedTestKey] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [designThinkingModalOpen, setDesignThinkingModalOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            setActivePage={setActivePage}
            setSelectedTestKey={setSelectedTestKey}
          />
        );
      case 'tests':
        return (
          <AssessmentHubPage
            initialTestKey={selectedTestKey}
            setActivePage={setActivePage}
          />
        );
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'report':
        return <AnalysisReportPage setActivePage={setActivePage} />;
      case 'disorders':
        return (
          <DisordersPage
            onOpenEmergency={() => setEmergencyModalOpen(true)}
            setActivePage={setActivePage}
          />
        );
      case 'lifestyle':
        return <LifestyleTrackerPage />;
      case 'doctor':
        return <DoctorConsultationPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-neuro-dark dark:text-slate-100 transition-colors duration-200">
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setSelectedTestKey(null);
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onOpenDesignThinking={() => setDesignThinkingModalOpen(true)}
      />

      <main className="flex-1 pt-4 sm:pt-6">
        {renderCurrentPage()}
      </main>

      <Footer
        setActivePage={(page) => {
          setSelectedTestKey(null);
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onOpenDesignThinking={() => setDesignThinkingModalOpen(true)}
      />

      {/* Floating AI Healthcare Assistant */}
      <ChatbotWidget />

      {/* Emergency Stroke Guidance Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* University Design Thinking Framework Modal */}
      <DesignThinkingModal
        isOpen={designThinkingModalOpen}
        onClose={() => setDesignThinkingModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
