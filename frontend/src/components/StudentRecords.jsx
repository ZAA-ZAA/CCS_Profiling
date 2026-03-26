import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, MoreVertical, Mail, Phone, GraduationCap, Trash2, Edit } from 'lucide-react';
import { StudentForm } from './StudentForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const StudentRecords = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYearLevel, setFilterYearLevel] = useState('');
  const [skillQuery, setSkillQuery] = useState('');
  const [activityQuery, setActivityQuery] = useState('');
  const [affiliationQuery, setAffiliationQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    contact_number: '',
    course: 'BSIT',
    year_level: '1st Year',
    enrollment_status: 'Enrolled'
  });

  // Add forms for comprehensive student data
  const [newSkill, setNewSkill] = useState('');
  const [newAcademicYear, setNewAcademicYear] = useState('');
  const [newAcademicCourse, setNewAcademicCourse] = useState('');
  const [newAcademicDetails, setNewAcademicDetails] = useState('');
  const [newActivityType, setNewActivityType] = useState('');
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDetails, setNewActivityDetails] = useState('');
  const [newViolationName, setNewViolationName] = useState('');
  const [newViolationSeverity, setNewViolationSeverity] = useState('Low');
  const [newViolationDate, setNewViolationDate] = useState('');
  const [newViolationDetails, setNewViolationDetails] = useState('');
  const [newAffiliationName, setNewAffiliationName] = useState('');
  const [newAffiliationCategory, setNewAffiliationCategory] = useState('Org');
  const [newAffiliationRole, setNewAffiliationRole] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchStudents({
        search: searchTerm,
        course: filterCourse,
        year_level: filterYearLevel,
        skill: skillQuery,
        activity: activityQuery,
        affiliation: affiliationQuery,
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchTerm, filterCourse, filterYearLevel, skillQuery, activityQuery, affiliationQuery]);

  const fetchStudents = async ({
    search = '',
    course = '',
    year_level = '',
    skill = '',
    activity = '',
    affiliation = '',
  } = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (course) params.append('course', course);
      if (year_level) params.append('year_level', year_level);
      if (skill) params.append('skill', skill);
      if (activity) params.append('activity', activity);
      if (affiliation) params.append('affiliation', affiliation);
      const qs = params.toString();
      const response = await fetch(`${API_URL}/api/students${qs ? `?${qs}` : ''}`);
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = useCallback(async (studentId) => {
    try {
      const response = await fetch(`${API_URL}/api/students/${studentId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedStudent(data.data);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  }, []);

  const handleSelectStudent = useCallback(async (student) => {
    if (!student) return;
    setSelectedStudent(student);
    if (student.id) {
      await fetchStudentDetails(student.id);
    }
  }, [fetchStudentDetails]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          student_id: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          email: '',
          contact_number: '',
          course: 'BSIT',
          year_level: '1st Year',
          enrollment_status: 'Enrolled'
        });
        fetchStudents({
          search: searchTerm,
          course: filterCourse,
          year_level: filterYearLevel,
          skill: skillQuery,
          activity: activityQuery,
          affiliation: affiliationQuery,
        });
        alert('Student added successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error adding student: ' + error.message);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        fetchStudents({
          search: searchTerm,
          course: filterCourse,
          year_level: filterYearLevel,
          skill: skillQuery,
          activity: activityQuery,
          affiliation: affiliationQuery,
        });
        setSelectedStudent(data.data);
        alert('Student updated successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error updating student: ' + error.message);
    }
  };

  const handleDeleteStudent = async () => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSelectedStudent(null);
        fetchStudents({
          search: searchTerm,
          course: filterCourse,
          year_level: filterYearLevel,
          skill: skillQuery,
          activity: activityQuery,
          affiliation: affiliationQuery,
        });
        alert('Student deleted successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error deleting student: ' + error.message);
    }
  };

  const refreshSelectedStudent = useCallback(async () => {
    if (!selectedStudent?.id) return;
    await fetchStudentDetails(selectedStudent.id);
  }, [fetchStudentDetails, selectedStudent]);

  const refreshStudentList = useCallback(async () => {
    await fetchStudents({
      search: searchTerm,
      course: filterCourse,
      year_level: filterYearLevel,
      skill: skillQuery,
      activity: activityQuery,
      affiliation: affiliationQuery,
    });
  }, [searchTerm, filterCourse, filterYearLevel, skillQuery, activityQuery, affiliationQuery]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) return;
    const skillName = newSkill.trim();
    if (!skillName) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name: skillName }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to add skill');

      setNewSkill('');
      await fetchStudentDetails(selectedStudent.id);
      await refreshStudentList();
    } catch (error) {
      alert('Error adding skill: ' + error.message);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!selectedStudent?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/skills/${skillId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete skill');
      await refreshSelectedStudent();
      await refreshStudentList();
    } catch (error) {
      alert('Error deleting skill: ' + error.message);
    }
  };

  const handleAddAcademicHistory = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/academic-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academic_year: newAcademicYear || null,
          course: newAcademicCourse || null,
          details: newAcademicDetails || null,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to add academic history');

      setNewAcademicYear('');
      setNewAcademicCourse('');
      setNewAcademicDetails('');
      await refreshSelectedStudent();
    } catch (error) {
      alert('Error adding academic history: ' + error.message);
    }
  };

  const handleDeleteAcademicHistory = async (historyId) => {
    if (!selectedStudent?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/academic-history/${historyId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete academic history');
      await refreshSelectedStudent();
    } catch (error) {
      alert('Error deleting academic history: ' + error.message);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: newActivityType || null,
          activity_name: newActivityName.trim(),
          details: newActivityDetails || null,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to add activity');

      setNewActivityType('');
      setNewActivityName('');
      setNewActivityDetails('');
      await refreshSelectedStudent();
      await refreshStudentList();
    } catch (error) {
      alert('Error adding activity: ' + error.message);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!selectedStudent?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/activities/${activityId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete activity');
      await refreshSelectedStudent();
      await refreshStudentList();
    } catch (error) {
      alert('Error deleting activity: ' + error.message);
    }
  };

  const handleAddViolation = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/violations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_name: newViolationName.trim(),
          severity: newViolationSeverity || null,
          date: newViolationDate || null,
          details: newViolationDetails || null,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to add violation');

      setNewViolationName('');
      setNewViolationSeverity('Low');
      setNewViolationDate('');
      setNewViolationDetails('');
      await refreshSelectedStudent();
    } catch (error) {
      alert('Error adding violation: ' + error.message);
    }
  };

  const handleDeleteViolation = async (violationId) => {
    if (!selectedStudent?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/violations/${violationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete violation');
      await refreshSelectedStudent();
    } catch (error) {
      alert('Error deleting violation: ' + error.message);
    }
  };

  const handleAddAffiliation = async (e) => {
    e.preventDefault();
    if (!selectedStudent?.id) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/affiliations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAffiliationName.trim(),
          category: newAffiliationCategory || null,
          role: newAffiliationRole || null,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to add affiliation');

      setNewAffiliationName('');
      setNewAffiliationCategory('Org');
      setNewAffiliationRole('');
      await refreshSelectedStudent();
      await refreshStudentList();
    } catch (error) {
      alert('Error adding affiliation: ' + error.message);
    }
  };

  const handleDeleteAffiliation = async (affiliationId) => {
    if (!selectedStudent?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}/affiliations/${affiliationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete affiliation');
      await refreshSelectedStudent();
      await refreshStudentList();
    } catch (error) {
      alert('Error deleting affiliation: ' + error.message);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      student_id: student.student_id || '',
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      middle_name: student.middle_name || '',
      email: student.email || '',
      contact_number: student.contact_number || '',
      course: student.course || 'BSIT',
      year_level: student.year_level || '1st Year',
      enrollment_status: student.enrollment_status || 'Enrolled'
    });
    setShowEditModal(true);
  };

  const filteredStudents = students;

  return (
    <div className="flex gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Student Profiles</h3>
              <p className="text-xs text-gray-500">Core module with query and filtering support.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <UserPlus size={18} />
              Add Student
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name, student ID, or email..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl px-4 py-2 outline-none"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              <option value="BSIT">BSIT</option>
              <option value="BSCS">BSCS</option>
              <option value="BSIS">BSIS</option>
            </select>
            <select 
              className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl px-4 py-2 outline-none"
              value={filterYearLevel}
              onChange={(e) => setFilterYearLevel(e.target.value)}
            >
              <option value="">All Year Levels</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <input
              type="text"
              placeholder="Filter by skill"
              className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by activity"
              className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none"
              value={activityQuery}
              onChange={(e) => setActivityQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by affiliation"
              className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none"
              value={affiliationQuery}
              onChange={(e) => setAffiliationQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Basketball', 'Programming'].map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => setSkillQuery(query)}
                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-200"
              >
                Query: {query}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterCourse('');
                setFilterYearLevel('');
                setSkillQuery('');
                setActivityQuery('');
                setAffiliationQuery('');
              }}
              className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 border border-gray-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading students...</div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">No students found</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Middle Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Year Level</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => handleSelectStudent(student)}
                    className={`hover:bg-orange-50/30 cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-orange-50/50' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.last_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.first_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.middle_name || '-'}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{student.student_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.year_level}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => openEditModal(student)}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"
                        title="Edit"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedStudent && (
        <div className="w-80 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-500">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.first_name}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 uppercase">
            {selectedStudent.first_name} {selectedStudent.middle_name || ''} {selectedStudent.last_name}
          </h3>
          <p className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-8">
            {selectedStudent.course} - {selectedStudent.student_id}
          </p>

          <div className="w-full space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Mail size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-700 truncate">{selectedStudent.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                <p className="text-sm text-gray-700">{selectedStudent.contact_number || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <GraduationCap size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enrollment Status</p>
                <p className="text-sm text-gray-700">{selectedStudent.enrollment_status}</p>
              </div>
            </div>

            {/* Comprehensive student data (midterm requirements) */}
            <div className="space-y-4 pt-2">
              <details open>
                <summary className="cursor-pointer text-sm font-bold text-gray-900">
                  Skills
                </summary>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(selectedStudent.skills || []).length > 0 ? (
                      selectedStudent.skills.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs"
                        >
                          {s.skill_name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteSkill(s.id);
                            }}
                            className="text-emerald-700 hover:text-emerald-900"
                            title="Remove skill"
                          >
                            x
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No skills yet</p>
                    )}
                  </div>
                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill (e.g., Basketball)"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={!newSkill.trim()}
                    >
                      Add
                    </button>
                  </form>
                </div>
              </details>

              <details>
                <summary className="cursor-pointer text-sm font-bold text-gray-900">
                  Academic History
                </summary>
                <div className="mt-2 space-y-2">
                  {(selectedStudent.academic_history || []).length > 0 ? (
                    <div className="space-y-2">
                      {selectedStudent.academic_history.map((h) => (
                        <div key={h.id} className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-800 truncate">
                            {h.course || 'Course'} {h.academic_year ? `(${h.academic_year})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAcademicHistory(h.id)}
                            className="text-red-600 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No academic history</p>
                  )}
                  <form onSubmit={handleAddAcademicHistory} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Academic Year (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newAcademicYear}
                      onChange={(e) => setNewAcademicYear(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Course (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newAcademicCourse}
                      onChange={(e) => setNewAcademicCourse(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Details (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newAcademicDetails}
                      onChange={(e) => setNewAcademicDetails(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Add Record
                    </button>
                  </form>
                </div>
              </details>

              <details>
                <summary className="cursor-pointer text-sm font-bold text-gray-900">
                  Non-Academic Activities
                </summary>
                <div className="mt-2 space-y-2">
                  {(selectedStudent.activities || []).length > 0 ? (
                    <div className="space-y-2">
                      {selectedStudent.activities.map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-800 truncate">
                            {a.activity_name} {a.activity_type ? `(${a.activity_type})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(a.id)}
                            className="text-red-600 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No activities</p>
                  )}
                  <form onSubmit={handleAddActivity} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Activity name *"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newActivityName}
                      onChange={(e) => setNewActivityName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Activity type (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Details (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newActivityDetails}
                      onChange={(e) => setNewActivityDetails(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Add Activity
                    </button>
                  </form>
                </div>
              </details>

              <details>
                <summary className="cursor-pointer text-sm font-bold text-gray-900">
                  Violations
                </summary>
                <div className="mt-2 space-y-2">
                  {(selectedStudent.violations || []).length > 0 ? (
                    <div className="space-y-2">
                      {selectedStudent.violations.map((v) => (
                        <div key={v.id} className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-800 truncate">
                            {v.violation_name}
                            {v.severity ? ` (${v.severity})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteViolation(v.id)}
                            className="text-red-600 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No violations</p>
                  )}
                  <form onSubmit={handleAddViolation} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Violation name *"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newViolationName}
                      onChange={(e) => setNewViolationName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Severity (Low/Medium/High)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newViolationSeverity}
                      onChange={(e) => setNewViolationSeverity(e.target.value)}
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newViolationDate}
                      onChange={(e) => setNewViolationDate(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Details (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newViolationDetails}
                      onChange={(e) => setNewViolationDetails(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Add Violation
                    </button>
                  </form>
                </div>
              </details>

              <details>
                <summary className="cursor-pointer text-sm font-bold text-gray-900">
                  Affiliations (Orgs/Sports)
                </summary>
                <div className="mt-2 space-y-2">
                  {(selectedStudent.affiliations || []).length > 0 ? (
                    <div className="space-y-2">
                      {selectedStudent.affiliations.map((af) => (
                        <div key={af.id} className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-800 truncate">
                            {af.name} {af.category ? `(${af.category})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAffiliation(af.id)}
                            className="text-red-600 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No affiliations</p>
                  )}
                  <form onSubmit={handleAddAffiliation} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Affiliation name *"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newAffiliationName}
                      onChange={(e) => setNewAffiliationName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category (Org/Sports/Team)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newAffiliationCategory}
                      onChange={(e) => setNewAffiliationCategory(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Role (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs focus:ring-2 focus:ring-emerald-500/20"
                      value={newAffiliationRole}
                      onChange={(e) => setNewAffiliationRole(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Add Affiliation
                    </button>
                  </form>
                </div>
              </details>
            </div>
          </div>

          <div className="mt-auto w-full pt-8 border-t border-gray-50 space-y-3">
            <button 
              onClick={() => openEditModal(selectedStudent)}
              className="w-full px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit Profile
            </button>
            <button 
              onClick={handleDeleteStudent}
              className="w-full px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Student
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <StudentForm 
          key="add"
          title="Add Student Profile"
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {showEditModal && (
        <StudentForm 
          key="edit"
          title="Edit Student Profile"
          onSubmit={handleEditStudent}
          onCancel={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
};
