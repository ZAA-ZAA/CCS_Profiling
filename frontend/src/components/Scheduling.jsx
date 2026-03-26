import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '../constants';
import { ScheduleForm } from './ScheduleForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export const Scheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedDay, setSelectedDay] = useState('All Days');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    course: 'BSIT',
    subject: '',
    instructor: '',
    room: '',
    day: 'Monday',
    start_time: '7:00 AM',
    end_time: '9:00 AM',
    students: 0,
    year_level: '1st Year',
    section: ''
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [selectedCourse, selectedDay]);

  const fetchFaculty = async () => {
    try {
      setFacultyLoading(true);
      const response = await fetch(`${API_URL}/api/faculty`);
      const data = await response.json();
      if (data.success) {
        setFaculty(data.data);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setFacultyLoading(false);
    }
  };

  const instructorOptions = faculty.map((f) => {
    const first = f.first_name || '';
    const middle = f.middle_name || '';
    const last = f.last_name || '';
    const name = `${first} ${middle} ${last}`.replace(/\s+/g, ' ').trim();
    const pos = f.position ? `${f.position} ` : '';
    const emp = f.employee_number ? ` (${f.employee_number})` : '';
    const label = `${pos}${name}${emp}`.trim();
    return { value: label, label };
  }).filter((x) => x.value);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCourse !== 'All Courses') params.append('course', selectedCourse);
      if (selectedDay !== 'All Days') params.append('day', selectedDay);
      
      const response = await fetch(`${API_URL}/api/schedules?${params}`);
      const data = await response.json();
      if (data.success) {
        setSchedules(data.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          course: 'BSIT',
          subject: '',
          instructor: '',
          room: '',
          day: 'Monday',
          start_time: '7:00 AM',
          end_time: '9:00 AM',
          students: 0,
          year_level: '1st Year',
          section: ''
        });
        fetchSchedules();
        alert('Schedule added successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error adding schedule: ' + error.message);
    }
  };

  const handleEditSchedule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/schedules/${selectedSchedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        setSelectedSchedule(null);
        fetchSchedules();
        alert('Schedule updated successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error updating schedule: ' + error.message);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/schedules/${selectedSchedule.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSelectedSchedule(null);
        fetchSchedules();
        alert('Schedule deleted successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error deleting schedule: ' + error.message);
    }
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      course: schedule.course || 'BSIT',
      subject: schedule.subject || '',
      instructor: schedule.instructor || '',
      room: schedule.room || '',
      day: schedule.day || 'Monday',
      start_time: schedule.start_time || '7:00 AM',
      end_time: schedule.end_time || '9:00 AM',
      students: schedule.students || 0,
      year_level: schedule.year_level || '1st Year',
      section: schedule.section || ''
    });
    setShowEditModal(true);
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || schedule.course === selectedCourse;
    const matchesDay = selectedDay === 'All Days' || schedule.day === selectedDay;
    return matchesSearch && matchesCourse && matchesDay;
  });

  const getScheduleByDayAndTime = (day, timeSlot) => {
    return filteredSchedules.find(s => {
      if (s.day !== day) return false;
      const startTime = s.start_time || '';
      return startTime.includes(timeSlot.split(':')[0]);
    });
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
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
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
            onChange={(e) => {
              setSelectedCourse(e.target.value);
            }}
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
            onChange={(e) => {
              setSelectedDay(e.target.value);
            }}
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
                <span className="text-sm font-bold text-gray-700">Current Week</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading schedules...</div>
            ) : (
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
                                  <span>{schedule.students || 0} students</span>
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
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading schedules...</div>
          ) : filteredSchedules.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No schedules found</div>
          ) : (
            filteredSchedules.map((schedule) => (
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
                      {schedule.year_level && schedule.section && (
                        <span className="text-xs font-bold text-gray-400">
                          {schedule.year_level} - Section {schedule.section}
                        </span>
                      )}
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
                          <p className="text-sm text-gray-700">{schedule.students || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(schedule);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSchedule(schedule);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Schedule Detail Modal */}
      {selectedSchedule && !showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedSchedule(null)}>
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
                  {selectedSchedule.year_level && selectedSchedule.section && (
                    <span className="text-xs font-bold text-gray-400">
                      {selectedSchedule.year_level} - Section {selectedSchedule.section}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSchedule.subject}</h2>
              </div>
              <button 
                onClick={() => setSelectedSchedule(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={20} />
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
                <p className="text-2xl font-bold text-gray-900">{selectedSchedule.students || 0} students</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => openEditModal(selectedSchedule)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                >
                  Edit Schedule
                </button>
                <button 
                  onClick={handleDeleteSchedule}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Delete Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ScheduleForm 
          key="add"
          title="Add New Schedule"
          onSubmit={handleAddSchedule}
          onCancel={() => setShowAddModal(false)}
          formData={formData}
          setFormData={setFormData}
          instructors={instructorOptions}
        />
      )}

      {showEditModal && (
        <ScheduleForm 
          key="edit"
          title="Edit Schedule"
          onSubmit={handleEditSchedule}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedSchedule(null);
          }}
          formData={formData}
          setFormData={setFormData}
          instructors={instructorOptions}
        />
      )}
    </div>
  );
};
