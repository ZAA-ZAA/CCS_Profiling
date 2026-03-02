import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Scale, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  LogOut,
  Users,
  Clock,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { UserRole, cn } from '../constants';

export const Sidebar = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'students', label: 'Student Records', icon: FileText, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'faculty', label: 'Faculty Records', icon: Scale, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'scheduling', label: 'Scheduling', icon: Clock, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'research', label: 'College Research', icon: BookOpen, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'instructions', label: 'Instructions', icon: GraduationCap, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'reports', label: 'Org. and Events Reports', icon: Calendar, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY] },
    { id: 'audit', label: 'Audit Logs', icon: MessageSquare, roles: [UserRole.DEAN, UserRole.CHAIR, UserRole.FACULTY, UserRole.SECRETARY], hasSubmenu: true },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Pamantasan_ng_Cabuyao_logo.png/200px-Pamantasan_ng_Cabuyao_logo.png" 
          alt="Logo" 
          className="h-10"
          referrerPolicy="no-referrer"
        />
        <div className="leading-tight">
          <p className="text-xs font-bold text-emerald-800">University of Cabuyao</p>
          <p className="text-[10px] text-gray-500">College of Computing Studies</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group",
              activeTab === item.id 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-200" 
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              {item.label}
            </div>
            {item.hasSubmenu && <ChevronRight size={14} className={cn("transition-transform", activeTab === item.id ? "rotate-90" : "")} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
              <Users size={16} />
            </div>
            <span className="text-sm font-bold text-gray-700">{role}</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <ChevronRight size={10} className="-rotate-90 text-gray-400" />
            <ChevronRight size={10} className="rotate-90 text-gray-400" />
          </div>
        </button>
        
        <button 
          onClick={onLogout}
          className="mt-4 w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          Logout Session
        </button>
      </div>
    </div>
  );
};
