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

export default function App() {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentRecords />;
      case 'faculty':
        return <FacultyRecords />;
      case 'scheduling':
        return <Scheduling />;
      case 'research':
        return <CollegeResearch />;
      case 'instructions':
        return <Instructions />;
      case 'reports':
        return <OrgEventsReports />;
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
            console.error('Logout request failed:', error);
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
          
          <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-2 text-sm">
            <ShieldCheck className="text-orange-600" size={18} />
            <div className="text-right leading-tight">
              <p className="font-semibold text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="min-w-0 flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
