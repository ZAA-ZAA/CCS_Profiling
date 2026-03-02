import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Mail, Phone, GraduationCap } from 'lucide-react';

const mockStudents = [
  { id: '1', student_number: '20015151', first_name: 'Jim Vincent', last_name: 'Bariring', middle_name: 'A.', email: 'jim@example.com', contact_number: '09123456789', course: 'BSIT', year_level: '4th Year', enrollment_status: 'Enrolled' },
  { id: '2', student_number: '20015152', first_name: 'Maria', last_name: 'Santos', middle_name: 'B.', email: 'maria@example.com', contact_number: '09123456780', course: 'BSCS', year_level: '3rd Year', enrollment_status: 'Enrolled' },
];

export const StudentRecords = () => {
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);

  return (
    <div className="flex gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 outline-none">
              <option>All Courses</option>
              <option>BSIT</option>
              <option>BSCS</option>
              <option>BSIS</option>
            </select>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <UserPlus size={18} />
              Add Student
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
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
              {mockStudents.map((student) => (
                <tr 
                  key={student.id} 
                  onClick={() => setSelectedStudent(student)}
                  className={`hover:bg-orange-50/30 cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-orange-50/50' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.last_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.first_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.middle_name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{student.student_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.year_level}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}
          </h3>
          <p className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-8">
            {selectedStudent.course} - {selectedStudent.student_number}
          </p>

          <div className="w-full space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Mail size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-700 truncate">{selectedStudent.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                <p className="text-sm text-gray-700">{selectedStudent.contact_number}</p>
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
          </div>

          <div className="mt-auto w-full pt-8 border-t border-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
              <button className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                View Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
