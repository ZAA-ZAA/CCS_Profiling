import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { StudentForm } from './StudentForm';
import { ModalShell } from './ui/ModalShell';
import { useUI } from './ui/UIProvider';
import { apiRequest } from '../lib/api';
import {
  ACTIVITY_TYPES,
  AFFILIATION_CATEGORIES,
  AFFILIATION_ROLES,
  CORE_COURSES,
  VIOLATION_SEVERITIES,
  YEAR_LEVELS,
} from '../lib/formOptions';
import { cn } from '../constants';
import { getInitials, parseOptionalJson } from '../lib/display';

const defaultStudentForm = {
  student_id: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  contact_number: '',
  course: 'BSIT',
  year_level: '1st Year',
  enrollment_status: 'Enrolled',
};

const defaultDetailForms = {
  skill: {
    skill_name: '',
    level: 'Intermediate',
  },
  academic: {
    academic_year: '',
    course: 'BSIT',
    school_name: '',
    start_period: '',
    end_period: '',
    award: '',
    notes: '',
  },
  activity: {
    activity_type: ACTIVITY_TYPES[0],
    activity_name: '',
    details: '',
  },
  violation: {
    violation_name: '',
    severity: VIOLATION_SEVERITIES[0],
    date: '',
    details: '',
  },
  affiliation: {
    category: AFFILIATION_CATEGORIES[0],
    name: '',
    role: AFFILIATION_ROLES[0],
  },
};

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Competitive'];
const violationSuggestions = [
  'Attendance',
  'Dress Code',
  'Late Submission',
  'Misconduct',
  'Property Damage',
];

function getTopItems(items, limit = 4) {
  const counts = new Map();

  items
    .filter(Boolean)
    .forEach((item) => counts.set(item, (counts.get(item) || 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function parseAcademicDetails(record) {
  const details = parseOptionalJson(record?.details, null);
  if (!details || Array.isArray(details)) {
    return null;
  }
  return details;
}

function buildAcademicPayload(form) {
  return {
    academic_year: form.academic_year.trim(),
    course: form.course,
    details: JSON.stringify({
      school_name: form.school_name.trim(),
      start_period: form.start_period.trim(),
      end_period: form.end_period.trim(),
      award: form.award.trim(),
      notes: form.notes.trim(),
    }),
  };
}

function studentMatchesSchedule(student, schedule) {
  if (!student || !schedule) {
    return false;
  }

  if (schedule.course !== student.course) {
    return false;
  }

  if (schedule.year_level && student.year_level) {
    return schedule.year_level === student.year_level;
  }

  return true;
}

function buildStudentPayload(formData) {
  return {
    student_id: (formData.student_id || '').trim(),
    first_name: (formData.first_name || '').trim(),
    last_name: (formData.last_name || '').trim(),
    middle_name: (formData.middle_name || '').trim(),
    email: (formData.email || '').trim(),
    contact_number: (formData.contact_number || '').trim(),
    course: formData.course,
    year_level: formData.year_level,
    enrollment_status: formData.enrollment_status,
  };
}

function DetailSectionCard({ title, subtitle, actionLabel, onAction, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-700"
          >
            <Plus size={14} />
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function ItemActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-2xl border border-slate-200 p-2 text-slate-400 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
        title="Edit item"
      >
        <Edit3 size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-2xl border border-slate-200 p-2 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        title="Delete item"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function StudentRecords({ navigationIntent, clearNavigationIntent, onNavigate }) {
  const { showError, showSuccess, showInfo, confirm } = useUI();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supportLoading, setSupportLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYearLevel, setFilterYearLevel] = useState('');
  const [skillQuery, setSkillQuery] = useState('');
  const [activityQuery, setActivityQuery] = useState('');
  const [affiliationQuery, setAffiliationQuery] = useState('');
  const [formData, setFormData] = useState(defaultStudentForm);
  const [detailForms, setDetailForms] = useState(defaultDetailForms);
  const [organizations, setOrganizations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [events, setEvents] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [lessons, setLessons] = useState([]);

  const fetchStudents = useCallback(
    async ({
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

        const query = params.toString();
        const response = await apiRequest(`/api/students${query ? `?${query}` : ''}`);
        setStudents(response.data || []);
      } catch (error) {
        showError('Unable to load student records', error.message);
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  const fetchSupportData = useCallback(async () => {
    try {
      setSupportLoading(true);
      const results = await Promise.allSettled([
        apiRequest('/api/organizations'),
        apiRequest('/api/schedules'),
        apiRequest('/api/reports?report_type=event'),
        apiRequest('/api/syllabus'),
        apiRequest('/api/curriculum'),
        apiRequest('/api/lessons'),
      ]);

      const [orgs, scheduleData, eventData, syllabusData, curriculumData, lessonData] = results.map(
        (result) => (result.status === 'fulfilled' ? result.value.data || [] : []),
      );

      setOrganizations(orgs);
      setSchedules(scheduleData);
      setEvents(eventData);
      setSyllabi(syllabusData);
      setCurricula(curriculumData);
      setLessons(lessonData);

      if (results.some((result) => result.status === 'rejected')) {
        showInfo('Some linked data is unavailable', 'Student profiles still work, but a few connected summaries may be incomplete.');
      }
    } finally {
      setSupportLoading(false);
    }
  }, [showInfo]);

  const fetchStudentDetails = useCallback(
    async (studentId) => {
      try {
        const response = await apiRequest(`/api/students/${studentId}`);
        setSelectedStudent(response.data);
        return response.data;
      } catch (error) {
        showError('Unable to open student profile', error.message);
        return null;
      }
    },
    [showError],
  );

  useEffect(() => {
    fetchSupportData();
  }, [fetchSupportData]);

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
  }, [searchTerm, filterCourse, filterYearLevel, skillQuery, activityQuery, affiliationQuery, fetchStudents]);

  useEffect(() => {
    if (navigationIntent?.tab !== 'students') {
      return;
    }

    const context = navigationIntent.context || {};
    if (Object.prototype.hasOwnProperty.call(context, 'search')) setSearchTerm(context.search || '');
    if (Object.prototype.hasOwnProperty.call(context, 'course')) setFilterCourse(context.course || '');
    if (Object.prototype.hasOwnProperty.call(context, 'year_level')) setFilterYearLevel(context.year_level || '');
    if (Object.prototype.hasOwnProperty.call(context, 'skill')) setSkillQuery(context.skill || '');
    if (Object.prototype.hasOwnProperty.call(context, 'activity')) setActivityQuery(context.activity || '');
    if (Object.prototype.hasOwnProperty.call(context, 'affiliation')) setAffiliationQuery(context.affiliation || '');

    if (context.studentId) {
      fetchStudentDetails(context.studentId);
    }

    clearNavigationIntent?.();
  }, [navigationIntent, clearNavigationIntent, fetchStudentDetails]);

  const refreshCurrentView = useCallback(async () => {
    await fetchStudents({
      search: searchTerm,
      course: filterCourse,
      year_level: filterYearLevel,
      skill: skillQuery,
      activity: activityQuery,
      affiliation: affiliationQuery,
    });

    if (selectedStudent?.id) {
      await fetchStudentDetails(selectedStudent.id);
    }
  }, [
    activityQuery,
    affiliationQuery,
    fetchStudentDetails,
    fetchStudents,
    filterCourse,
    filterYearLevel,
    searchTerm,
    selectedStudent?.id,
    skillQuery,
  ]);

  const quickSkillQueries = useMemo(
    () => getTopItems(students.flatMap((student) => (student.skills || []).map((skill) => skill.skill_name))),
    [students],
  );

  const quickActivityQueries = useMemo(
    () =>
      getTopItems(
        students.flatMap((student) => (student.activities || []).map((activity) => activity.activity_name || activity.activity_type)),
        3,
      ),
    [students],
  );

  const quickAffiliationQueries = useMemo(
    () => getTopItems(students.flatMap((student) => (student.affiliations || []).map((item) => item.name)), 3),
    [students],
  );

  const skillSuggestions = useMemo(
    () => getTopItems(students.flatMap((student) => (student.skills || []).map((skill) => skill.skill_name)), 10).map((item) => item.label),
    [students],
  );

  const activitySuggestions = useMemo(
    () =>
      getTopItems(
        students.flatMap((student) => (student.activities || []).map((activity) => activity.activity_name || activity.activity_type)),
        10,
      ).map((item) => item.label),
    [students],
  );

  const affiliationSuggestions = useMemo(() => {
    const organizationNames = organizations.map((org) => org.name);
    const existingAffiliations = students.flatMap((student) => (student.affiliations || []).map((item) => item.name));
    return [...new Set([...organizationNames, ...existingAffiliations].filter(Boolean))].sort();
  }, [organizations, students]);

  const selectedStudentSchedules = useMemo(
    () => schedules.filter((schedule) => studentMatchesSchedule(selectedStudent, schedule)),
    [schedules, selectedStudent],
  );

  const selectedStudentSyllabi = useMemo(() => {
    if (!selectedStudent) {
      return [];
    }

    const relatedSubjects = new Set(selectedStudentSchedules.map((schedule) => schedule.subject?.toLowerCase()).filter(Boolean));
    return syllabi.filter((syllabus) => {
      if (syllabus.course !== selectedStudent.course) {
        return false;
      }

      if (relatedSubjects.size === 0) {
        return true;
      }

      const subject = (syllabus.subject || '').toLowerCase();
      const code = (syllabus.code || '').toLowerCase();
      return [...relatedSubjects].some((value) => subject.includes(value) || value.includes(subject) || code.includes(value));
    });
  }, [selectedStudent, selectedStudentSchedules, syllabi]);

  const selectedStudentLessons = useMemo(() => {
    const syllabusIds = new Set(selectedStudentSyllabi.map((item) => item.id));
    return lessons.filter((lesson) => syllabusIds.has(lesson.syllabus_id));
  }, [lessons, selectedStudentSyllabi]);

  const selectedStudentCurriculum = useMemo(
    () => curricula.find((curriculum) => curriculum.course === selectedStudent?.course) || null,
    [curricula, selectedStudent],
  );

  const selectedStudentEvents = useMemo(() => {
    if (!selectedStudent) {
      return [];
    }

    const affiliations = new Set((selectedStudent.affiliations || []).map((item) => item.name?.toLowerCase()).filter(Boolean));
    return events.filter((event) => affiliations.has((event.organization || '').toLowerCase()));
  }, [events, selectedStudent]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCourse('');
    setFilterYearLevel('');
    setSkillQuery('');
    setActivityQuery('');
    setAffiliationQuery('');
  };

  const handleSelectStudent = async (studentId) => {
    await fetchStudentDetails(studentId);
  };

  const openAddStudentModal = () => {
    setFormData(defaultStudentForm);
    setShowAddModal(true);
  };

  const openEditStudentModal = (student) => {
    setFormData({
      student_id: student.student_id || '',
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      middle_name: student.middle_name || '',
      email: student.email || '',
      contact_number: student.contact_number || '',
      course: student.course || 'BSIT',
      year_level: student.year_level || '1st Year',
      enrollment_status: student.enrollment_status || 'Enrolled',
    });
    setShowEditModal(true);
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    try {
      const response = await apiRequest('/api/students', {
        method: 'POST',
        body: buildStudentPayload(formData),
      });
      setShowAddModal(false);
      setFormData(defaultStudentForm);
      await refreshCurrentView();
      await fetchStudentDetails(response.data.id);
      showSuccess('Student profile added', 'The new student is now part of the searchable list.');
    } catch (error) {
      showError('Unable to add student', error.message);
    }
  };

  const handleEditStudent = async (event) => {
    event.preventDefault();
    if (!selectedStudent?.id) {
      return;
    }

    try {
      await apiRequest(`/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        body: buildStudentPayload(formData),
      });
      setShowEditModal(false);
      await refreshCurrentView();
      showSuccess('Student profile updated', 'The profile details were saved successfully.');
    } catch (error) {
      showError('Unable to update student', error.message);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent?.id) {
      return;
    }

    const approved = await confirm({
      title: 'Delete student profile?',
      description: `This will remove ${selectedStudent.first_name} ${selectedStudent.last_name} and all connected student detail records.`,
      confirmText: 'Delete student',
      tone: 'danger',
    });

    if (!approved) {
      return;
    }

    try {
      await apiRequest(`/api/students/${selectedStudent.id}`, { method: 'DELETE' });
      setSelectedStudent(null);
      await refreshCurrentView();
      showSuccess('Student deleted', 'The student profile was removed.');
    } catch (error) {
      showError('Unable to delete student', error.message);
    }
  };

  const openDetailModal = (type, item = null) => {
    if (type === 'skill') {
      setDetailForms((current) => ({
        ...current,
        skill: {
          skill_name: item?.skill_name || '',
          level: item?.level || 'Intermediate',
        },
      }));
    }

    if (type === 'academic') {
      const details = parseAcademicDetails(item) || {};
      setDetailForms((current) => ({
        ...current,
        academic: {
          academic_year: item?.academic_year || '',
          course: item?.course || selectedStudent?.course || 'BSIT',
          school_name: details.school_name || '',
          start_period: details.start_period || '',
          end_period: details.end_period || '',
          award: details.award || '',
          notes: details.notes || (item?.details && !details.school_name ? item.details : ''),
        },
      }));
    }

    if (type === 'activity') {
      setDetailForms((current) => ({
        ...current,
        activity: {
          activity_type: item?.activity_type || ACTIVITY_TYPES[0],
          activity_name: item?.activity_name || '',
          details: item?.details || '',
        },
      }));
    }

    if (type === 'violation') {
      setDetailForms((current) => ({
        ...current,
        violation: {
          violation_name: item?.violation_name || '',
          severity: item?.severity || VIOLATION_SEVERITIES[0],
          date: item?.date ? item.date.split('T')[0] : '',
          details: item?.details || '',
        },
      }));
    }

    if (type === 'affiliation') {
      setDetailForms((current) => ({
        ...current,
        affiliation: {
          category: item?.category || AFFILIATION_CATEGORIES[0],
          name: item?.name || '',
          role: item?.role || AFFILIATION_ROLES[0],
        },
      }));
    }

    setDetailModal({ type, mode: item ? 'edit' : 'add', item });
  };

  const closeDetailModal = () => {
    setDetailModal(null);
    setDetailForms(defaultDetailForms);
  };

  const handleDetailSubmit = async (event) => {
    event.preventDefault();
    if (!selectedStudent?.id || !detailModal?.type) {
      return;
    }

    const endpointMap = {
      skill: 'skills',
      academic: 'academic-history',
      activity: 'activities',
      violation: 'violations',
      affiliation: 'affiliations',
    };

    const payloadMap = {
      skill: detailForms.skill,
      academic: buildAcademicPayload(detailForms.academic),
      activity: {
        activity_type: detailForms.activity.activity_type,
        activity_name: detailForms.activity.activity_name.trim(),
        details: detailForms.activity.details.trim(),
      },
      violation: {
        violation_name: detailForms.violation.violation_name.trim(),
        severity: detailForms.violation.severity,
        date: detailForms.violation.date,
        details: detailForms.violation.details.trim(),
      },
      affiliation: {
        category: detailForms.affiliation.category,
        name: detailForms.affiliation.name.trim(),
        role: detailForms.affiliation.role,
      },
    };

    const basePath = `/api/students/${selectedStudent.id}/${endpointMap[detailModal.type]}`;
    const url = detailModal.mode === 'edit' ? `${basePath}/${detailModal.item.id}` : basePath;

    try {
      await apiRequest(url, {
        method: detailModal.mode === 'edit' ? 'PUT' : 'POST',
        body: payloadMap[detailModal.type],
      });
      closeDetailModal();
      await refreshCurrentView();
      showSuccess(
        `${detailModal.mode === 'edit' ? 'Updated' : 'Added'} successfully`,
        `The ${detailModal.type.replace('-', ' ')} record is now part of the student profile.`,
      );
    } catch (error) {
      showError('Unable to save record', error.message);
    }
  };

  const handleDeleteDetail = async (type, item) => {
    if (!selectedStudent?.id || !item?.id) {
      return;
    }

    const endpointMap = {
      skill: 'skills',
      academic: 'academic-history',
      activity: 'activities',
      violation: 'violations',
      affiliation: 'affiliations',
    };

    const labelMap = {
      skill: item.skill_name,
      academic: item.course || item.academic_year || 'Academic History',
      activity: item.activity_name,
      violation: item.violation_name,
      affiliation: item.name,
    };

    const approved = await confirm({
      title: `Delete ${type} record?`,
      description: `This removes "${labelMap[type] || 'selected record'}" from ${selectedStudent.first_name}'s profile.`,
      confirmText: 'Delete record',
      tone: 'danger',
    });

    if (!approved) {
      return;
    }

    try {
      await apiRequest(`/api/students/${selectedStudent.id}/${endpointMap[type]}/${item.id}`, {
        method: 'DELETE',
      });
      await refreshCurrentView();
      showSuccess('Record deleted', 'The student detail entry was removed.');
    } catch (error) {
      showError('Unable to delete record', error.message);
    }
  };

  const renderDetailModalContent = () => {
    if (!detailModal) {
      return null;
    }

    if (detailModal.type === 'skill') {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Skill name *</span>
              <input
                list="skill-options"
                type="text"
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                value={detailForms.skill.skill_name}
                onChange={(event) =>
                  setDetailForms((current) => ({
                    ...current,
                    skill: { ...current.skill, skill_name: event.target.value },
                  }))
                }
                placeholder="e.g., Programming"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Proficiency</span>
              <select
                className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                value={detailForms.skill.level}
                onChange={(event) =>
                  setDetailForms((current) => ({
                    ...current,
                    skill: { ...current.skill, level: event.target.value },
                  }))
                }
              >
                {skillLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
          </div>
          <datalist id="skill-options">
            {skillSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </>
      );
    }

    if (detailModal.type === 'academic') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Academic year *</span>
            <input
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.academic_year}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, academic_year: event.target.value },
                }))
              }
              placeholder="e.g., 2024-2025"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Course</span>
            <select
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.course}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, course: event.target.value },
                }))
              }
            >
              {CORE_COURSES.map((course) => (
                <option key={course}>{course}</option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">School / Institution</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.school_name}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, school_name: event.target.value },
                }))
              }
              placeholder="e.g., University of Cabuyao"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Start period</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.start_period}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, start_period: event.target.value },
                }))
              }
              placeholder="e.g., August 2024"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">End period</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.end_period}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, end_period: event.target.value },
                }))
              }
              placeholder="e.g., May 2025"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Awards / distinctions</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.award}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, award: event.target.value },
                }))
              }
              placeholder="e.g., Dean's Lister"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.academic.notes}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  academic: { ...current.academic, notes: event.target.value },
                }))
              }
              placeholder="Add optional notes for this record"
            />
          </label>
        </div>
      );
    }

    if (detailModal.type === 'activity') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Activity type *</span>
            <select
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.activity.activity_type}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  activity: { ...current.activity, activity_type: event.target.value },
                }))
              }
            >
              {ACTIVITY_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Activity name *</span>
            <input
              list="activity-options"
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.activity.activity_name}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  activity: { ...current.activity, activity_name: event.target.value },
                }))
              }
              placeholder="e.g., Hackathon Kickoff"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Details</span>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.activity.details}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  activity: { ...current.activity, details: event.target.value },
                }))
              }
              placeholder="Role, outcome, or participation notes"
            />
          </label>
          <datalist id="activity-options">
            {activitySuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>
      );
    }

    if (detailModal.type === 'violation') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Violation name *</span>
            <input
              list="violation-options"
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.violation.violation_name}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  violation: { ...current.violation, violation_name: event.target.value },
                }))
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Severity</span>
            <select
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.violation.severity}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  violation: { ...current.violation, severity: event.target.value },
                }))
              }
            >
              {VIOLATION_SEVERITIES.map((severity) => (
                <option key={severity}>{severity}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Date</span>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.violation.date}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  violation: { ...current.violation, date: event.target.value },
                }))
              }
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Resolution notes</span>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.violation.details}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  violation: { ...current.violation, details: event.target.value },
                }))
              }
            />
          </label>
          <datalist id="violation-options">
            {violationSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Category *</span>
          <select
            className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            value={detailForms.affiliation.category}
            onChange={(event) =>
              setDetailForms((current) => ({
                ...current,
                affiliation: {
                  ...current.affiliation,
                  category: event.target.value,
                  name:
                    event.target.value === 'Organization' && organizations[0]
                      ? organizations[0].name
                      : current.affiliation.name,
                },
              }))
            }
          >
            {AFFILIATION_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
          <select
            className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            value={detailForms.affiliation.role}
            onChange={(event) =>
              setDetailForms((current) => ({
                ...current,
                affiliation: { ...current.affiliation, role: event.target.value },
              }))
            }
          >
            {AFFILIATION_ROLES.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Affiliation name *</span>
          {detailForms.affiliation.category === 'Organization' ? (
            <select
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.affiliation.name}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  affiliation: { ...current.affiliation, name: event.target.value },
                }))
              }
            >
              <option value="">Select organization</option>
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.name}>
                  {organization.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              list="affiliation-options"
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              value={detailForms.affiliation.name}
              onChange={(event) =>
                setDetailForms((current) => ({
                  ...current,
                  affiliation: { ...current.affiliation, name: event.target.value },
                }))
              }
              placeholder="e.g., Basketball Team"
            />
          )}
          <datalist id="affiliation-options">
            {affiliationSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </label>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Student Profiles</h3>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter, and manage the complete student record in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Results</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{students.length}</p>
              </div>
              <div className="rounded-2xl bg-orange-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Query Ready</p>
                <p className="mt-1 text-lg font-bold text-orange-700">Skills, activities, affiliations</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Linked Data</p>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {supportLoading ? 'Loading...' : 'Schedules, events, instructions'}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddStudentModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-700"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="relative block xl:col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search name, student ID, or email..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-200 focus:bg-white focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-orange-200 focus:bg-white focus:ring-2 focus:ring-orange-200"
            value={filterCourse}
            onChange={(event) => setFilterCourse(event.target.value)}
          >
            <option value="">All Courses</option>
            {CORE_COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-orange-200 focus:bg-white focus:ring-2 focus:ring-orange-200"
            value={filterYearLevel}
            onChange={(event) => setFilterYearLevel(event.target.value)}
          >
            <option value="">All Year Levels</option>
            {YEAR_LEVELS.map((yearLevel) => (
              <option key={yearLevel} value={yearLevel}>
                {yearLevel}
              </option>
            ))}
          </select>

          <input
            list="skill-options"
            type="text"
            placeholder="Filter by skill"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-200 focus:bg-white focus:ring-2 focus:ring-orange-200"
            value={skillQuery}
            onChange={(event) => setSkillQuery(event.target.value)}
          />

          <input
            list="activity-options"
            type="text"
            placeholder="Filter by activity"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-200 focus:bg-white focus:ring-2 focus:ring-orange-200"
            value={activityQuery}
            onChange={(event) => setActivityQuery(event.target.value)}
          />

          <input
            list="affiliation-options"
            type="text"
            placeholder="Filter by affiliation"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-200 focus:bg-white focus:ring-2 focus:ring-orange-200"
            value={affiliationQuery}
            onChange={(event) => setAffiliationQuery(event.target.value)}
          />
        </div>

        <div className="mt-5 space-y-3">
          {quickSkillQueries.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                <Sparkles size={12} />
                Popular skill queries
              </span>
              {quickSkillQueries.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSkillQuery(item.label)}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-100"
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          ) : null}

          {quickActivityQueries.length > 0 || quickAffiliationQueries.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {quickActivityQueries.map((item) => (
                <button
                  key={`activity-${item.label}`}
                  type="button"
                  onClick={() => setActivityQuery(item.label)}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  Activity: {item.label}
                </button>
              ))}
              {quickAffiliationQueries.map((item) => (
                <button
                  key={`aff-${item.label}`}
                  type="button"
                  onClick={() => setAffiliationQuery(item.label)}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-100"
                >
                  Affiliation: {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Reset Filters
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading student profiles...</div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-semibold text-slate-700">No student profiles found.</p>
              <p className="mt-2 text-sm text-slate-500">Try adjusting the filters or add a new student profile.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Student</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Student ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Course</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Year</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Highlights</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 text-sm font-bold text-orange-700">
                          {getInitials(student.first_name, student.last_name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {student.last_name}, {student.first_name} {student.middle_name ? `${student.middle_name[0]}.` : ''}
                          </p>
                          <p className="text-xs text-slate-500">{student.email || 'No email on file'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{student.student_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.course}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.year_level}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(student.skills || []).slice(0, 2).map((skill) => (
                          <span key={skill.id} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            {skill.skill_name}
                          </span>
                        ))}
                        {(student.affiliations || []).slice(0, 1).map((affiliation) => (
                          <span key={affiliation.id} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                            {affiliation.name}
                          </span>
                        ))}
                        {(student.skills || []).length === 0 && (student.affiliations || []).length === 0 ? (
                          <span className="text-xs text-slate-400">No enrichment data yet</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectStudent(student.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(student);
                            openEditStudentModal(student);
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {selectedStudent && !showEditModal ? (
        <ModalShell
          onClose={() => setSelectedStudent(null)}
          title="Student Profile"
          description="Comprehensive student information with linked schedules, instructions, activities, and event participation."
          size="max-w-7xl"
        >
          <div className="space-y-6">
            <div className="rounded-[32px] bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-2xl font-bold text-orange-700 shadow-sm ring-1 ring-orange-100">
                    {getInitials(selectedStudent.first_name, selectedStudent.last_name)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedStudent.first_name} {selectedStudent.middle_name || ''} {selectedStudent.last_name}
                      </h2>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        {selectedStudent.course} - {selectedStudent.student_id}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span>{selectedStudent.email || 'No email on file'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>{selectedStudent.contact_number || 'No contact number'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-slate-400" />
                        <span>{selectedStudent.enrollment_status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openEditStudentModal(selectedStudent)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteStudent}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Delete Student
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
              <div className="space-y-6">
                <DetailSectionCard title="Skills" subtitle="Add validated skills used by the query feature." actionLabel="Add skill" onAction={() => openDetailModal('skill')}>
                  {(selectedStudent.skills || []).length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{skill.skill_name}</p>
                            <p className="text-xs text-slate-500">{skill.level || 'No level specified'}</p>
                          </div>
                          <ItemActionButtons
                            onEdit={() => openDetailModal('skill', skill)}
                            onDelete={() => handleDeleteDetail('skill', skill)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No skills recorded yet.</p>
                  )}
                </DetailSectionCard>

                <DetailSectionCard title="Academic History" subtitle="Track yearly records, institution details, and awards." actionLabel="Add record" onAction={() => openDetailModal('academic')}>
                  {(selectedStudent.academic_history || []).length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.academic_history.map((record) => {
                        const details = parseAcademicDetails(record);
                        return (
                          <div key={record.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {record.course || selectedStudent.course} • {record.academic_year || 'Academic year not set'}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                  {details?.school_name || 'School not specified'}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                                  {details?.start_period ? <span>Start: {details.start_period}</span> : null}
                                  {details?.end_period ? <span>End: {details.end_period}</span> : null}
                                  {details?.award ? <span>Award: {details.award}</span> : null}
                                </div>
                                {details?.notes || (!details && record.details) ? (
                                  <p className="mt-2 text-sm text-slate-500">{details?.notes || record.details}</p>
                                ) : null}
                              </div>
                              <ItemActionButtons
                                onEdit={() => openDetailModal('academic', record)}
                                onDelete={() => handleDeleteDetail('academic', record)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No academic history recorded yet.</p>
                  )}
                </DetailSectionCard>

                <DetailSectionCard title="Non-Academic Activities" subtitle="Document organizations, competitions, and student life involvement." actionLabel="Add activity" onAction={() => openDetailModal('activity')}>
                  {(selectedStudent.activities || []).length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.activities.map((activity) => (
                        <div key={activity.id} className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{activity.activity_name}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              {activity.activity_type || 'Activity'}
                            </p>
                            {activity.details ? <p className="mt-2 text-sm text-slate-500">{activity.details}</p> : null}
                          </div>
                          <ItemActionButtons
                            onEdit={() => openDetailModal('activity', activity)}
                            onDelete={() => handleDeleteDetail('activity', activity)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No activities recorded yet.</p>
                  )}
                </DetailSectionCard>

                <DetailSectionCard title="Violations" subtitle="Standardized severity levels help avoid inconsistent encoding." actionLabel="Add violation" onAction={() => openDetailModal('violation')}>
                  {(selectedStudent.violations || []).length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.violations.map((violation) => (
                        <div key={violation.id} className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{violation.violation_name}</p>
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-1 text-[11px] font-bold',
                                  violation.severity === 'Critical'
                                    ? 'bg-red-100 text-red-700'
                                    : violation.severity === 'High'
                                      ? 'bg-orange-100 text-orange-700'
                                      : violation.severity === 'Moderate'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-200 text-slate-700',
                                )}
                              >
                                {violation.severity || 'Unspecified'}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">
                              {violation.date ? new Date(violation.date).toLocaleDateString() : 'Date not recorded'}
                            </p>
                            {violation.details ? <p className="mt-2 text-sm text-slate-500">{violation.details}</p> : null}
                          </div>
                          <ItemActionButtons
                            onEdit={() => openDetailModal('violation', violation)}
                            onDelete={() => handleDeleteDetail('violation', violation)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No violations recorded yet.</p>
                  )}
                </DetailSectionCard>

                <DetailSectionCard title="Affiliations" subtitle="Link students to organizations, teams, and clubs for event matching." actionLabel="Add affiliation" onAction={() => openDetailModal('affiliation')}>
                  {(selectedStudent.affiliations || []).length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.affiliations.map((affiliation) => (
                        <div key={affiliation.id} className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{affiliation.name}</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                              {affiliation.category ? <span>{affiliation.category}</span> : null}
                              {affiliation.role ? <span>Role: {affiliation.role}</span> : null}
                            </div>
                          </div>
                          <ItemActionButtons
                            onEdit={() => openDetailModal('affiliation', affiliation)}
                            onDelete={() => handleDeleteDetail('affiliation', affiliation)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No affiliations recorded yet.</p>
                  )}
                </DetailSectionCard>
              </div>

              <div className="space-y-6">
                <DetailSectionCard title="Assigned Schedule" subtitle="Schedules are matched by course and year level for faster advising.">
                  {selectedStudentSchedules.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudentSchedules.map((schedule) => (
                        <button
                          key={schedule.id}
                          type="button"
                          onClick={() => onNavigate?.('scheduling', { scheduleId: schedule.id })}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-orange-200 hover:bg-orange-50"
                        >
                          <p className="text-sm font-bold text-slate-900">{schedule.subject}</p>
                          <p className="mt-1 text-sm text-slate-500">{schedule.day} • {schedule.time}</p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {schedule.instructor} • {schedule.room}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No schedule currently matches this student’s course and year level.</p>
                  )}
                </DetailSectionCard>

                <DetailSectionCard title="Instruction Coverage" subtitle="Relevant syllabus, curriculum, and lesson plans tied to this student.">
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Curriculum</p>
                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {selectedStudentCurriculum?.program || 'No curriculum matched'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedStudentCurriculum
                          ? `${selectedStudentCurriculum.totalUnits} total units • ${selectedStudentCurriculum.year}`
                          : 'Add or align curriculum data for this course to show the full program path.'}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Linked syllabi</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">{selectedStudentSyllabi.length} record(s)</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        {selectedStudentSyllabi.slice(0, 3).map((syllabus) => (
                          <button
                            key={syllabus.id}
                            type="button"
                            onClick={() => onNavigate?.('instructions', { type: 'syllabus', syllabusId: syllabus.id, course: selectedStudent.course })}
                            className="w-full rounded-2xl bg-white px-3 py-3 text-left transition-colors hover:bg-orange-50"
                          >
                            <p className="text-sm font-bold text-slate-900">{syllabus.code} • {syllabus.subject}</p>
                            <p className="mt-1 text-xs text-slate-500">{syllabus.semester} • {syllabus.instructor}</p>
                          </button>
                        ))}
                        {selectedStudentSyllabi.length === 0 ? (
                          <p className="text-sm text-slate-500">No syllabus matches found yet.</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Lesson plans</p>
                      <p className="mt-2 text-sm font-bold text-slate-900">{selectedStudentLessons.length} lesson(s) connected</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Lessons are matched from the linked syllabus set for this student’s current course flow.
                      </p>
                    </div>
                  </div>
                </DetailSectionCard>

                <DetailSectionCard title="Affiliated Events" subtitle="Events are suggested from the student’s organization affiliations.">
                  {selectedStudentEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudentEvents.map((eventRecord) => (
                        <button
                          key={eventRecord.id}
                          type="button"
                          onClick={() => onNavigate?.('reports', { eventId: eventRecord.id })}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-orange-200 hover:bg-orange-50"
                        >
                          <p className="text-sm font-bold text-slate-900">{eventRecord.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{eventRecord.organization || 'General Event'}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                            <span>{new Date(eventRecord.date).toLocaleDateString()}</span>
                            <span>{eventRecord.time || 'TBD'}</span>
                            <span>{eventRecord.venue || 'Venue not set'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No organization-based event match yet. Add affiliations to improve this recommendation list.
                    </p>
                  )}
                </DetailSectionCard>

                <DetailSectionCard title="Presentation Notes" subtitle="Helpful cues for the live demo and defense.">
                  <div className="space-y-3">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <Users className="mt-0.5 text-orange-600" size={18} />
                        <p className="text-sm text-slate-600">
                          This profile already connects to schedule, instructions, and event records so you can demonstrate real data relationships during the presentation.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldAlert className="mt-0.5 text-orange-600" size={18} />
                        <p className="text-sm text-slate-600">
                          Use the standardized skill, activity, affiliation, and severity values to reduce user error and produce cleaner query results.
                        </p>
                      </div>
                    </div>
                  </div>
                </DetailSectionCard>
              </div>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {detailModal ? (
        <ModalShell
          onClose={closeDetailModal}
          title={`${detailModal.mode === 'edit' ? 'Edit' : 'Add'} ${detailModal.type === 'academic' ? 'Academic History' : detailModal.type === 'activity' ? 'Non-Academic Activity' : detailModal.type.charAt(0).toUpperCase() + detailModal.type.slice(1)}`}
          description="Use the structured fields below to keep the student profile consistent and searchable."
          size="max-w-3xl"
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDetailModal}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="student-detail-form"
                className="rounded-2xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                {detailModal.mode === 'edit' ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
          }
        >
          <form id="student-detail-form" onSubmit={handleDetailSubmit} className="space-y-4">
            {renderDetailModalContent()}
          </form>
        </ModalShell>
      ) : null}

      {showAddModal ? (
        <StudentForm
          key="add-student"
          title="Add Student Profile"
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      ) : null}

      {showEditModal ? (
        <StudentForm
          key="edit-student"
          title="Edit Student Profile"
          onSubmit={handleEditStudent}
          onCancel={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      ) : null}
    </div>
  );
}
