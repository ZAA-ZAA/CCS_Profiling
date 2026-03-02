import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Building2
} from 'lucide-react';
import { cn } from '../constants';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const mockSchedules = [
  {
    id: '1',
    course: 'BSIT',
    subject: 'Web Development',
    instructor: 'Prof. John Smith',
    room: 'Lab 101',
    day: 'Monday',
    time: '9:00 AM - 11:00 AM',
    students: 45,
    yearLevel: '3rd Year',
    section: 'A'
  },
  {
    id: '2',
    course: 'BSCS',
    subject: 'Data Structures',
    instructor: 'Prof. Maria Garcia',
    room: 'Lab 202',
    day: 'Tuesday',
    time: '1:00 PM - 3:00 PM',
    students: 38,
    yearLevel: '2nd Year',
    section: 'B'
  },
  {
    id: '3',
    course: 'BSIS',
    subject: 'Database Management',
    instructor: 'Prof. Robert Lee',
    room: 'Lab 103',
    day: 'Wednesday',
    time: '10:00 AM - 12:00 PM',
    students: 42,
    yearLevel: '3rd Year',
    section: 'A'
  },
  {
    id: '4',
    course: 'BSIT',
    subject: 'Mobile App Development',
    instructor: 'Prof. Sarah Johnson',
    room: 'Lab 201',
    day: 'Thursday',
    time: '2:00 PM - 4:00 PM',
    students: 40,
    yearLevel: '4th Year',
    section: 'A'
  },
  {
    id: '5',
    course: 'BSCS',
    subject: 'Algorithm Design',
    instructor: 'Prof. Michael Chen',
    room: 'Lab 102',
    day: 'Friday',
    time: '8:00 AM - 10:00 AM',
    students: 35,
    yearLevel: '3rd Year',
    section: 'C'
  },
];

export const Scheduling = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedDay, setSelectedDay] = useState('All Days');

  const filteredSchedules = mockSchedules.filter(schedule => {
    const matchesSearch = schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || schedule.course === selectedCourse;
    const matchesDay = selectedDay === 'All Days' || schedule.day === selectedDay;
    return matchesSearch && matchesCourse && matchesDay;
  });

  const getScheduleByDayAndTime = (day, timeSlot) => {
    return filteredSchedules.find(s => s.day === day && s.time.includes(timeSlot));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Scheduling</h2>
          <p className="text-sm text-gray-500">Manage and view class schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                viewMode === 'calendar' 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                viewMode === 'list' 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              List View
            </button>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by subject, instructor, or room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option>All Courses</option>
            <option>BSIT</option>
            <option>BSCS</option>
            <option>BSIS</option>
            <option>BSEMC</option>
          </select>
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option>All Days</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Weekly Schedule</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold text-gray-700">Week of May 1, 2025</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100">Time</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100 last:border-r-0">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 whitespace-nowrap">
                      {timeSlot}
                    </td>
                  {daysOfWeek.map(day => {
                    const schedule = getScheduleByDayAndTime(day, timeSlot);
                    return (
                      <td key={day} className="px-2 py-2 border-r border-gray-100 last:border-r-0">
                        {schedule ? (
                          <div 
                            className="bg-orange-50 border border-orange-200 rounded-lg p-3 cursor-pointer hover:bg-orange-100 transition-colors"
                            onClick={() => setSelectedSchedule(schedule)}
                          >
                            <p className="text-xs font-bold text-gray-900 mb-1">{schedule.subject}</p>
                            <p className="text-[10px] text-gray-600 mb-1">{schedule.instructor}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                              <MapPin size={10} />
                              <span>{schedule.room}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                              <Users size={10} />
                              <span>{schedule.students} students</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-20"></div>
                        )}
                      </td>
                    );
                  })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div 
              key={schedule.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedSchedule(schedule)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      {schedule.course}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {schedule.yearLevel} - Section {schedule.section}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{schedule.subject}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400" size={16} />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instructor</p>
                        <p className="text-sm text-gray-700">{schedule.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-400" size={16} />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Day & Time</p>
                        <p className="text-sm text-gray-700">{schedule.day}, {schedule.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-400" size={16} />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Room</p>
                        <p className="text-sm text-gray-700">{schedule.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400" size={16} />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Students</p>
                        <p className="text-sm text-gray-700">{schedule.students}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSchedule(null)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {selectedSchedule.course}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {selectedSchedule.yearLevel} - Section {selectedSchedule.section}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSchedule.subject}</h2>
              </div>
              <button 
                onClick={() => setSelectedSchedule(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instructor</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedSchedule.instructor}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Room</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedSchedule.room}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Day</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedSchedule.day}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedSchedule.time}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-gray-400" size={16} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enrolled Students</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{selectedSchedule.students} students</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                  Edit Schedule
                </button>
                <button className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors">
                  View Students
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
