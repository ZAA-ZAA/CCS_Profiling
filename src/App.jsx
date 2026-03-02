import React, { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentRecords } from './components/StudentRecords';
import { FacultyRecords } from './components/FacultyRecords';
import { Scheduling } from './components/Scheduling';
import { CollegeResearch } from './components/CollegeResearch';
import { Instructions } from './components/Instructions';
import { OrgEventsReports } from './components/OrgEventsReports';
import { Bell, Search } from 'lucide-react';
import { UserRole } from './constants';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login onLogin={(role) => setUser({ role })} />;
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
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        role={user.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setUser(null)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
