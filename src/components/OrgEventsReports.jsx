import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  Download, 
  Filter,
  Search,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { cn } from '../constants';

const organizations = [
  { id: '1', name: 'CCS', fullName: 'College of Computing Studies', members: 245, events: 12, status: 'Active', color: 'bg-blue-500' },
  { id: '2', name: 'SITES', fullName: 'Society of Information Technology and Engineering Students', members: 180, events: 8, status: 'Active', color: 'bg-green-500' },
  { id: '3', name: 'ACSS', fullName: 'Association of Computer Science Students', members: 165, events: 10, status: 'Active', color: 'bg-purple-500' },
  { id: '4', name: 'COE', fullName: 'Computer Organization and Engineering', members: 120, events: 6, status: 'Active', color: 'bg-orange-500' },
];

const events = [
  {
    id: '1',
    title: 'IT Week 2025',
    organization: 'CCS',
    date: '2025-05-15',
    time: '08:00 AM',
    venue: 'Main Auditorium',
    status: 'Upcoming',
    participants: 450,
    registered: 420,
    description: 'Annual IT Week celebration featuring tech talks, competitions, and networking events.',
    category: 'Academic'
  },
  {
    id: '2',
    title: 'Hackathon 2025',
    organization: 'SITES',
    date: '2025-05-20',
    time: '09:00 AM',
    venue: 'Computer Lab 1-3',
    status: 'Registration Open',
    participants: 200,
    registered: 185,
    description: '48-hour coding competition open to all students. Prizes and certificates will be awarded.',
    category: 'Competition'
  },
  {
    id: '3',
    title: 'CCS General Assembly',
    organization: 'CCS',
    date: '2025-05-05',
    time: '01:00 PM',
    venue: 'Conference Hall',
    status: 'Completed',
    participants: 300,
    registered: 280,
    description: 'Quarterly general assembly meeting for all CCS students and faculty members.',
    category: 'Meeting'
  },
  {
    id: '4',
    title: 'Tech Innovation Seminar',
    organization: 'ACSS',
    date: '2025-05-10',
    time: '02:00 PM',
    venue: 'Lecture Hall A',
    status: 'Upcoming',
    participants: 150,
    registered: 140,
    description: 'Guest speakers from industry leaders discussing latest trends in technology.',
    category: 'Seminar'
  },
  {
    id: '5',
    title: 'Tara Kape Proposal',
    organization: 'COE',
    date: '2025-04-28',
    time: '10:40 AM',
    venue: 'Student Lounge',
    status: 'Pending Approval',
    participants: 80,
    registered: 75,
    description: 'Informal networking event with coffee and light refreshments.',
    category: 'Social'
  },
  {
    id: '6',
    title: 'Web Development Workshop',
    organization: 'SITES',
    date: '2025-05-25',
    time: '10:00 AM',
    venue: 'Computer Lab 2',
    status: 'Registration Open',
    participants: 100,
    registered: 95,
    description: 'Hands-on workshop covering modern web development frameworks and tools.',
    category: 'Workshop'
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-600';
    case 'Upcoming':
      return 'bg-blue-50 text-blue-600';
    case 'Registration Open':
      return 'bg-orange-50 text-orange-600';
    case 'Pending Approval':
      return 'bg-yellow-50 text-yellow-600';
    case 'Cancelled':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return CheckCircle2;
    case 'Upcoming':
      return Clock;
    case 'Registration Open':
      return TrendingUp;
    case 'Pending Approval':
      return AlertCircle;
    case 'Cancelled':
      return XCircle;
    default:
      return AlertCircle;
  }
};

export const OrgEventsReports = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = !selectedOrg || event.organization === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization & Events Reports</h2>
          <p className="text-sm text-gray-500">Detailed reports and information about organizations and events</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('events')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-colors border-b-2",
            activeTab === 'events'
              ? "text-orange-600 border-orange-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            Events Reports
          </div>
        </button>
        <button
          onClick={() => setActiveTab('organizations')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-colors border-b-2",
            activeTab === 'organizations'
              ? "text-orange-600 border-orange-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Building2 size={16} />
            Organization Reports
          </div>
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
              <select 
                value={selectedOrg || ''}
                onChange={(e) => setSelectedOrg(e.target.value || null)}
                className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="">All Organizations</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.name}>{org.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const StatusIcon = getStatusIcon(event.status);
              return (
                <div 
                  key={event.id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn("w-3 h-3 rounded-full", organizations.find(o => o.name === event.organization)?.color || 'bg-gray-300')}></div>
                        <span className="text-xs font-bold text-gray-400">{event.organization}</span>
                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1", getStatusColor(event.status))}>
                          <StatusIcon size={10} />
                          {event.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <MapPin size={14} />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Participation</p>
                        <p className="text-sm font-bold text-gray-900">{event.registered} / {event.participants} registered</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
                        <p className="text-sm font-bold text-gray-900">{event.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Organizations Tab */}
      {activeTab === 'organizations' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search organizations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrgs.map((org) => (
              <div 
                key={org.id}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold", org.color)}>
                      {org.name}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.fullName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {org.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-gray-400" size={16} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Members</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{org.members}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-gray-400" size={16} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Events</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{org.events}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors">
                    <FileText size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Modal/View */}
      {selectedEvent && activeTab === 'events' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-3 h-3 rounded-full", organizations.find(o => o.name === selectedEvent.organization)?.color || 'bg-gray-300')}></div>
                  <span className="text-xs font-bold text-gray-400">{selectedEvent.organization}</span>
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1", getStatusColor(selectedEvent.status))}>
                    {selectedEvent.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedEvent.time}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Venue</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedEvent.venue}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Participants</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedEvent.registered} / {selectedEvent.participants}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                  View Full Report
                </button>
                <button className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

