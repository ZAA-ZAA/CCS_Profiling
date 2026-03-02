import React from 'react';
import { 
  Users, 
  UserSquare2, 
  UserPlus, 
  Calendar, 
  Bell,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from '../constants';

const data = [
  { name: 'BSIT', students: 400 },
  { name: 'BSCS', students: 300 },
  { name: 'BSIS', students: 200 },
];

export const Dashboard = () => {
  const stats = [
    { label: 'TOTAL STUDENTS', value: '1,245', icon: Users, trend: '+12%', up: true },
    { label: 'TOTAL FACULTY', value: '48', icon: UserSquare2, trend: '+2', up: true },
    { label: 'NEW STUDENTS', value: '156', icon: UserPlus, trend: '-5%', up: false },
    { label: 'UPCOMING EVENTS', value: '4', icon: Calendar, trend: 'Next: IT Week', up: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <stat.icon className="text-gray-600" size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Student Enrollment by Course</h3>
            <select className="bg-gray-50 border-none text-sm font-medium rounded-lg px-3 py-2 outline-none">
              <option>Academic Year 2023-2024</option>
              <option>Academic Year 2022-2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#ea580c" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-8">News and Events</h3>
          <div className="space-y-6">
            {[
              { title: 'Tara Kape Proposal', status: 'Not seen yet', date: '28/04/2025', time: '10:40 pm' },
              { title: 'CCS General Assembly', status: 'Upcoming', date: '05/05/2025', time: '01:00 pm' },
              { title: 'Hackathon 2025', status: 'Registration Open', date: '12/05/2025', time: '08:00 am' },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="p-3 bg-orange-50 rounded-xl h-fit">
                  <Bell className="text-orange-600" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{event.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
