import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, Mail, Phone, Building2, Calendar, Trash2, Edit } from 'lucide-react';
import { FacultyForm } from './FacultyForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const FacultyRecords = () => {
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    contact_number: '',
    department: 'BSIT',
    position: '',
    employment_start_date: '',
    employment_status: 'Full-time'
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/faculty`);
      const data = await response.json();
      if (data.success) {
        setFaculty(data.data);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/faculty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          employee_number: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          email: '',
          contact_number: '',
          department: 'BSIT',
          position: '',
          employment_start_date: '',
          employment_status: 'Full-time'
        });
        fetchFaculty();
        alert('Faculty added successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error adding faculty: ' + error.message);
    }
  };

  const handleEditFaculty = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/faculty/${selectedFaculty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        fetchFaculty();
        setSelectedFaculty(data.data);
        alert('Faculty updated successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error updating faculty: ' + error.message);
    }
  };

  const handleDeleteFaculty = async () => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/faculty/${selectedFaculty.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSelectedFaculty(null);
        fetchFaculty();
        alert('Faculty deleted successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error deleting faculty: ' + error.message);
    }
  };

  const openEditModal = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setFormData({
      employee_number: facultyMember.employee_number || '',
      first_name: facultyMember.first_name || '',
      last_name: facultyMember.last_name || '',
      middle_name: facultyMember.middle_name || '',
      email: facultyMember.email || '',
      contact_number: facultyMember.contact_number || '',
      department: facultyMember.department || 'BSIT',
      position: facultyMember.position || '',
      employment_start_date: facultyMember.employment_start_date ? facultyMember.employment_start_date.split('T')[0] : '',
      employment_status: facultyMember.employment_status || 'Full-time'
    });
    setShowEditModal(true);
  };

  const calculateYearsOfService = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getFullYear() - start.getFullYear();
    return diff;
  };

  const filteredFaculty = faculty.filter(facultyMember => {
    const matchesSearch = 
      facultyMember.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facultyMember.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facultyMember.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facultyMember.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || facultyMember.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="flex gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Faculty Profiles</h3>
            <p className="text-xs text-gray-500 mt-1">Manage faculty records used for scheduling and academic coordination.</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search faculty..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 outline-none"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="BSIT">BSIT</option>
              <option value="BSCS">BSCS</option>
              <option value="BSIS">BSIS</option>
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <UserPlus size={18} />
              Add Faculty
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading faculty...</div>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">No faculty found</div>
            </div>
          ) : (
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
                {filteredFaculty.map((facultyMember) => (
                  <tr 
                    key={facultyMember.id} 
                    onClick={() => setSelectedFaculty(facultyMember)}
                    className={`hover:bg-orange-50/30 cursor-pointer transition-colors ${selectedFaculty?.id === facultyMember.id ? 'bg-orange-50/50' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{facultyMember.last_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{facultyMember.first_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{facultyMember.middle_name || '-'}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{facultyMember.employee_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{facultyMember.department}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => openEditModal(facultyMember)}
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
            {selectedFaculty.first_name} {selectedFaculty.middle_name || ''} {selectedFaculty.last_name}
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
                <p className="text-sm text-gray-700 truncate">{selectedFaculty.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                <p className="text-sm text-gray-700">{selectedFaculty.contact_number || 'N/A'}</p>
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

          <div className="mt-auto w-full pt-8 border-t border-gray-50 space-y-3">
            <button 
              onClick={() => openEditModal(selectedFaculty)}
              className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Update Profile
            </button>
            <button 
              onClick={handleDeleteFaculty}
              className="w-full px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Faculty
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <FacultyForm 
          key="add"
          title="Add New Faculty"
          onSubmit={handleAddFaculty}
          onCancel={() => setShowAddModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {showEditModal && (
        <FacultyForm 
          key="edit"
          title="Edit Faculty"
          onSubmit={handleEditFaculty}
          onCancel={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

    </div>
  );
};
