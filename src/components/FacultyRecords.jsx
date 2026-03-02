import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Mail, Phone, Building2, Calendar } from 'lucide-react';

const mockFaculty = [
  { id: '1', employee_number: '20015151', first_name: 'Jim Vincent', last_name: 'Bariring', middle_name: 'A.', email: 'jim.faculty@example.com', contact_number: '09123456789', department: 'BSIT', employment_start_date: '2020-01-15', employment_status: 'Full-time' },
  { id: '2', employee_number: '20015152', first_name: 'Sarah', last_name: 'Lee', middle_name: 'C.', email: 'sarah@example.com', contact_number: '09123456780', department: 'BSCS', employment_start_date: '2018-06-20', employment_status: 'Full-time' },
];

export const FacultyRecords = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(mockFaculty[0]);

  const calculateYearsOfService = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getFullYear() - start.getFullYear();
    return diff;
  };

  return (
    <div className="flex gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search faculty..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 outline-none">
              <option>All Departments</option>
              <option>BSIT</option>
              <option>BSCS</option>
              <option>BSIS</option>
            </select>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <UserPlus size={18} />
              Add Faculty
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
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee Number</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockFaculty.map((faculty) => (
                <tr 
                  key={faculty.id} 
                  onClick={() => setSelectedFaculty(faculty)}
                  className={`hover:bg-orange-50/30 cursor-pointer transition-colors ${selectedFaculty?.id === faculty.id ? 'bg-orange-50/50' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{faculty.last_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{faculty.first_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{faculty.middle_name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{faculty.employee_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{faculty.department}</td>
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

      {selectedFaculty && (
        <div className="w-80 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-500">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFaculty.first_name}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 uppercase">
            {selectedFaculty.first_name} {selectedFaculty.middle_name} {selectedFaculty.last_name}
          </h3>
          <p className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-8">
            {selectedFaculty.department} - {selectedFaculty.employee_number}
          </p>

          <div className="w-full space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Mail size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-700 truncate">{selectedFaculty.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                <p className="text-sm text-gray-700">{selectedFaculty.contact_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Years of Service</p>
                <p className="text-sm text-gray-700">{calculateYearsOfService(selectedFaculty.employment_start_date)} Years</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Building2 size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employment Status</p>
                <p className="text-sm text-gray-700">{selectedFaculty.employment_status}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto w-full pt-8 border-t border-gray-50">
            <button className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
