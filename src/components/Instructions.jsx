import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Clock,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '../constants';

const mockSyllabi = [
  {
    id: '1',
    course: 'BSIT',
    subject: 'Web Development',
    code: 'IT 301',
    instructor: 'Prof. John Smith',
    semester: '1st Semester',
    academicYear: '2024-2025',
    units: 3,
    hours: 54,
    description: 'Introduction to modern web development technologies including HTML5, CSS3, JavaScript, and frameworks.',
    objectives: [
      'Understand fundamental web technologies',
      'Build responsive web applications',
      'Implement modern JavaScript frameworks',
      'Deploy web applications'
    ],
    topics: [
      { week: 1, topic: 'Introduction to Web Development', hours: 3 },
      { week: 2, topic: 'HTML5 and Semantic Markup', hours: 3 },
      { week: 3, topic: 'CSS3 and Styling', hours: 3 },
      { week: 4, topic: 'JavaScript Fundamentals', hours: 6 },
      { week: 5, topic: 'DOM Manipulation', hours: 3 },
      { week: 6, topic: 'Responsive Design', hours: 6 },
      { week: 7, topic: 'JavaScript Frameworks (React)', hours: 9 },
      { week: 8, topic: 'State Management', hours: 6 },
      { week: 9, topic: 'API Integration', hours: 6 },
      { week: 10, topic: 'Deployment and Hosting', hours: 6 },
      { week: 11, topic: 'Project Development', hours: 6 },
      { week: 12, topic: 'Final Project Presentation', hours: 3 }
    ],
    requirements: [
      { type: 'Quizzes', weight: 20 },
      { type: 'Assignments', weight: 30 },
      { type: 'Project', weight: 40 },
      { type: 'Participation', weight: 10 }
    ],
    status: 'Active'
  },
  {
    id: '2',
    course: 'BSCS',
    subject: 'Data Structures and Algorithms',
    code: 'CS 201',
    instructor: 'Prof. Maria Garcia',
    semester: '1st Semester',
    academicYear: '2024-2025',
    units: 3,
    hours: 54,
    description: 'Comprehensive study of data structures and algorithms including arrays, linked lists, trees, graphs, and sorting algorithms.',
    objectives: [
      'Master fundamental data structures',
      'Understand algorithm complexity',
      'Implement efficient algorithms',
      'Solve complex programming problems'
    ],
    topics: [
      { week: 1, topic: 'Introduction to Data Structures', hours: 3 },
      { week: 2, topic: 'Arrays and Linked Lists', hours: 6 },
      { week: 3, topic: 'Stacks and Queues', hours: 6 },
      { week: 4, topic: 'Trees and Binary Trees', hours: 9 },
      { week: 5, topic: 'Binary Search Trees', hours: 6 },
      { week: 6, topic: 'Heaps and Priority Queues', hours: 6 },
      { week: 7, topic: 'Graphs and Graph Algorithms', hours: 9 },
      { week: 8, topic: 'Sorting Algorithms', hours: 6 },
      { week: 9, topic: 'Searching Algorithms', hours: 3 },
      { week: 10, topic: 'Hash Tables', hours: 6 }
    ],
    requirements: [
      { type: 'Exams', weight: 40 },
      { type: 'Laboratory Exercises', weight: 30 },
      { type: 'Projects', weight: 25 },
      { type: 'Participation', weight: 5 }
    ],
    status: 'Active'
  },
];

const mockCurricula = [
  {
    id: '1',
    course: 'BSIT',
    program: 'Bachelor of Science in Information Technology',
    year: '2024',
    totalUnits: 180,
    semesters: [
      {
        semester: '1st Year - 1st Semester',
        subjects: [
          { code: 'IT 101', name: 'Introduction to IT', units: 3 },
          { code: 'CS 101', name: 'Programming Fundamentals', units: 3 },
          { code: 'MATH 101', name: 'Discrete Mathematics', units: 3 },
          { code: 'ENG 101', name: 'Communication Skills', units: 3 },
          { code: 'PE 101', name: 'Physical Education', units: 2 }
        ]
      },
      {
        semester: '1st Year - 2nd Semester',
        subjects: [
          { code: 'IT 102', name: 'Web Development', units: 3 },
          { code: 'CS 102', name: 'Object-Oriented Programming', units: 3 },
          { code: 'MATH 102', name: 'Calculus', units: 3 },
          { code: 'ENG 102', name: 'Technical Writing', units: 3 },
          { code: 'PE 102', name: 'Physical Education', units: 2 }
        ]
      }
    ],
    status: 'Active'
  },
  {
    id: '2',
    course: 'BSCS',
    program: 'Bachelor of Science in Computer Science',
    year: '2024',
    totalUnits: 180,
    semesters: [
      {
        semester: '1st Year - 1st Semester',
        subjects: [
          { code: 'CS 101', name: 'Introduction to Computer Science', units: 3 },
          { code: 'CS 102', name: 'Programming Fundamentals', units: 3 },
          { code: 'MATH 101', name: 'Discrete Mathematics', units: 3 },
          { code: 'MATH 103', name: 'Linear Algebra', units: 3 },
          { code: 'ENG 101', name: 'Communication Skills', units: 3 }
        ]
      }
    ],
    status: 'Active'
  },
];

const mockLessons = [
  {
    id: '1',
    syllabusId: '1',
    title: 'Introduction to Web Development',
    week: 1,
    duration: '3 hours',
    type: 'Lecture',
    materials: [
      { name: 'Introduction to Web Development.pdf', type: 'PDF', size: '2.5 MB' },
      { name: 'Web Development Basics.pptx', type: 'PPT', size: '5.2 MB' }
    ],
    activities: [
      { name: 'Quiz 1: Web Fundamentals', dueDate: '2024-09-15', status: 'Completed' },
      { name: 'Assignment 1: HTML Basics', dueDate: '2024-09-20', status: 'Pending' }
    ],
    objectives: [
      'Understand the history of web development',
      'Identify key web technologies',
      'Set up development environment'
    ],
    status: 'Published'
  },
  {
    id: '2',
    syllabusId: '1',
    title: 'HTML5 and Semantic Markup',
    week: 2,
    duration: '3 hours',
    type: 'Lecture',
    materials: [
      { name: 'HTML5 Guide.pdf', type: 'PDF', size: '3.1 MB' },
      { name: 'Semantic HTML Examples.zip', type: 'ZIP', size: '1.8 MB' }
    ],
    activities: [
      { name: 'Lab Exercise: HTML Structure', dueDate: '2024-09-27', status: 'Pending' }
    ],
    objectives: [
      'Master HTML5 semantic elements',
      'Create well-structured HTML documents',
      'Understand accessibility principles'
    ],
    status: 'Published'
  },
];

export const Instructions = () => {
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus', 'curriculum', 'lessons'
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [expandedWeeks, setExpandedWeeks] = useState({});

  const filteredSyllabi = mockSyllabi.filter(syllabus => {
    const matchesSearch = syllabus.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         syllabus.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         syllabus.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || syllabus.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const filteredCurricula = mockCurricula.filter(curriculum => {
    const matchesSearch = curriculum.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curriculum.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || curriculum.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Instructions</h2>
          <p className="text-sm text-gray-500">Syllabus, Curriculum, and Lessons management</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-colors border-b-2",
            activeTab === 'syllabus'
              ? "text-orange-600 border-orange-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} />
            Syllabus
          </div>
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-colors border-b-2",
            activeTab === 'curriculum'
              ? "text-orange-600 border-orange-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <GraduationCap size={16} />
            Curriculum
          </div>
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-colors border-b-2",
            activeTab === 'lessons'
              ? "text-orange-600 border-orange-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            Lessons
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
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
        </div>
      </div>

      {/* Syllabus Tab */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          {filteredSyllabi.map((syllabus) => (
            <div 
              key={syllabus.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedSyllabus(syllabus)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      {syllabus.course}
                    </span>
                    <span className="text-xs font-bold text-gray-400">{syllabus.code}</span>
                    <span className="text-xs text-gray-400">{syllabus.semester} {syllabus.academicYear}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{syllabus.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{syllabus.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} />
                      <span>{syllabus.units} units</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{syllabus.hours} hours</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{syllabus.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
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

      {/* Curriculum Tab */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          {filteredCurricula.map((curriculum) => (
            <div 
              key={curriculum.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      {curriculum.course}
                    </span>
                    <span className="text-xs text-gray-400">Curriculum {curriculum.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{curriculum.program}</h3>
                  <p className="text-sm text-gray-600">Total Units: {curriculum.totalUnits}</p>
                </div>
                <button 
                  onClick={() => setSelectedCurriculum(curriculum)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  View Details
                </button>
              </div>
              
              <div className="space-y-3">
                {curriculum.semesters.slice(0, 2).map((sem, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">{sem.semester}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sem.subjects.map((subject, sIdx) => (
                        <div key={sIdx} className="text-sm text-gray-600">
                          <span className="font-mono text-xs text-gray-400">{subject.code}</span> - {subject.name} ({subject.units} units)
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <div 
              key={lesson.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      Week {lesson.week}
                    </span>
                    <span className="text-xs text-gray-400">{lesson.type}</span>
                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{lesson.title}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Learning Objectives</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {lesson.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                      <span>{lesson.materials.length} materials</span>
                      <span>{lesson.activities.length} activities</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Syllabus Detail Modal */}
      {selectedSyllabus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSyllabus(null)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {selectedSyllabus.course}
                  </span>
                  <span className="text-xs font-bold text-gray-400">{selectedSyllabus.code}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSyllabus.subject}</h2>
                <p className="text-sm text-gray-600">{selectedSyllabus.description}</p>
              </div>
              <button 
                onClick={() => setSelectedSyllabus(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Instructor</p>
                  <p className="text-sm font-bold text-gray-900">{selectedSyllabus.instructor}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Units</p>
                  <p className="text-sm font-bold text-gray-900">{selectedSyllabus.units}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Hours</p>
                  <p className="text-sm font-bold text-gray-900">{selectedSyllabus.hours}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Semester</p>
                  <p className="text-sm font-bold text-gray-900">{selectedSyllabus.semester}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Course Objectives</h3>
                <ul className="space-y-2">
                  {selectedSyllabus.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Course Topics</h3>
                <div className="space-y-2">
                  {selectedSyllabus.topics.map((topic, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Week {topic.week}: {topic.topic}</p>
                        <p className="text-xs text-gray-500 mt-1">{topic.hours} hours</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Grading System</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedSyllabus.requirements.map((req, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-bold text-gray-900">{req.type}</p>
                      <p className="text-xs text-gray-500">{req.weight}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download PDF
                </button>
                <button className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors">
                  Edit Syllabus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Detail Modal */}
      {selectedCurriculum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCurriculum(null)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {selectedCurriculum.course}
                  </span>
                  <span className="text-xs text-gray-400">Curriculum {selectedCurriculum.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCurriculum.program}</h2>
                <p className="text-sm text-gray-600">Total Units: {selectedCurriculum.totalUnits}</p>
              </div>
              <button 
                onClick={() => setSelectedCurriculum(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {selectedCurriculum.semesters.map((sem, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{sem.semester}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sem.subjects.map((subject, sIdx) => (
                      <div key={sIdx} className="p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{subject.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{subject.code}</p>
                          </div>
                          <span className="text-xs font-bold text-orange-600">{subject.units} units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLesson(null)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    Week {selectedLesson.week}
                  </span>
                  <span className="text-xs text-gray-400">{selectedLesson.type}</span>
                  <span className="text-xs text-gray-400">{selectedLesson.duration}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Learning Objectives</h3>
                <ul className="space-y-2">
                  {selectedLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Materials</h3>
                <div className="space-y-2">
                  {selectedLesson.materials.map((material, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-400" size={18} />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{material.name}</p>
                          <p className="text-xs text-gray-500">{material.type} • {material.size}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Activities</h3>
                <div className="space-y-2">
                  {selectedLesson.activities.map((activity, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{activity.name}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(activity.dueDate).toLocaleDateString()}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-3 py-1 rounded-full",
                        activity.status === 'Completed' 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-yellow-50 text-yellow-600"
                      )}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

