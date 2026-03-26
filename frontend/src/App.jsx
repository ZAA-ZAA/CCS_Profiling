import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentRecords } from './components/StudentRecords';
import { FacultyRecords } from './components/FacultyRecords';
import { Scheduling } from './components/Scheduling';
import { CollegeResearch } from './components/CollegeResearch';
import { Instructions } from './components/Instructions';
import { OrgEventsReports } from './components/OrgEventsReports';
import { AuditLogs } from './components/AuditLogs';
import { ShieldCheck } from 'lucide-react';
import { apiRequest } from './lib/api';
import { UIProvider, useUI } from './components/ui/UIProvider';
import { AccountSettingsModal } from './components/AccountSettingsModal';

function AppShell() {
  const pageTitles = {
    dashboard: 'Dashboard',
    students: 'Student Profile',
    faculty: 'Faculty Profile',
    scheduling: 'Scheduling',
    research: 'College Research',
    instructions: 'Instructions',
    reports: 'Events',
    audit: 'Audit Logs',
  };

  // Load user from localStorage on mount
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  const [showRegister, setShowRegister] = useState(false);
  const [navigationIntent, setNavigationIntent] = useState(null);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const { showError } = useUI();

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Save activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  if (!user) {
    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return <Login onLogin={(userData) => setUser(userData)} onSwitchToRegister={() => setShowRegister(true)} />;
  }

  const handleNavigate = (tab, context = null) => {
    setActiveTab(tab);
    setNavigationIntent({
      tab,
      context,
      timestamp: Date.now(),
    });
  };

  const clearNavigationIntent = () => {
    setNavigationIntent(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'students':
        return (
          <StudentRecords
            navigationIntent={navigationIntent}
            clearNavigationIntent={clearNavigationIntent}
            onNavigate={handleNavigate}
          />
        );
      case 'faculty':
        return (
          <FacultyRecords
            navigationIntent={navigationIntent}
            clearNavigationIntent={clearNavigationIntent}
            onNavigate={handleNavigate}
          />
        );
      case 'scheduling':
        return (
          <Scheduling
            navigationIntent={navigationIntent}
            clearNavigationIntent={clearNavigationIntent}
            onNavigate={handleNavigate}
          />
        );
      case 'research':
        return <CollegeResearch />;
      case 'instructions':
        return (
          <Instructions
            navigationIntent={navigationIntent}
            clearNavigationIntent={clearNavigationIntent}
          />
        );
      case 'reports':
        return (
          <OrgEventsReports
            navigationIntent={navigationIntent}
            clearNavigationIntent={clearNavigationIntent}
            onNavigate={handleNavigate}
          />
        );
      case 'audit':
        return <AuditLogs />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Module Under Construction</h2>
              <p>The {activeTab} module is currently being developed.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        role={user.role || 'FACULTY'} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={async () => {
          try {
            await apiRequest('/api/auth/logout', {
              method: 'POST',
              body: {
                username: user?.username,
                email: user?.email,
                tenant_id: user?.tenant_id,
              }
            });
          } catch (error) {
            showError('Logout sync failed', error.message);
          } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('activeTab');
          }
        }}
      />
      
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {pageTitles[activeTab] || activeTab.replace('-', ' ')}
          </h2>
          
          <button
            type="button"
            onClick={() => setShowAccountSettings(true)}
            className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-2 text-left text-sm transition-colors hover:bg-orange-100"
          >
            <ShieldCheck className="text-orange-600" size={18} />
            <div className="text-right leading-tight">
              <p className="font-semibold text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </button>
        </header>

        {/* Content Area */}
        <div className="min-w-0 flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>

      {showAccountSettings ? (
        <AccountSettingsModal
          user={user}
          onClose={() => setShowAccountSettings(false)}
          onUserUpdated={(nextUser) => setUser(nextUser)}
        />
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <UIProvider>
      <AppShell />
    </UIProvider>
  );
}
