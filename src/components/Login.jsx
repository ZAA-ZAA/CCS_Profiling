import React, { useState } from 'react';
import { UserRole } from '../constants';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.toLowerCase().includes('dean')) onLogin(UserRole.DEAN);
    else if (email.toLowerCase().includes('chair')) onLogin(UserRole.CHAIR);
    else if (email.toLowerCase().includes('faculty')) onLogin(UserRole.FACULTY);
    else onLogin(UserRole.SECRETARY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-200 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full min-h-[600px]"
      >
        <div className="flex-1 p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Pamantasan_ng_Cabuyao_logo.png/200px-Pamantasan_ng_Cabuyao_logo.png" 
              alt="University Logo" 
              className="h-20 mb-4"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl font-bold text-emerald-800 text-center">CCS Student Profiling</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="text-right">
              <button type="button" className="text-sm text-emerald-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              LOGIN
            </button>
          </form>
        </div>

        <div className="flex-1 bg-zinc-900 relative overflow-hidden hidden md:flex items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://picsum.photos/seed/ccs/1000/1000" 
              alt="Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="w-64 h-64 bg-orange-500 rounded-full flex items-center justify-center p-4 border-8 border-orange-600 shadow-2xl mb-8 mx-auto">
               <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Pamantasan_ng_Cabuyao_logo.png/200px-Pamantasan_ng_Cabuyao_logo.png" 
                alt="CCS Logo" 
                className="w-full h-full object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-white text-3xl font-bold tracking-wider">COLLEGE OF COMPUTING STUDIES</h2>
            <p className="text-orange-400 mt-2 font-medium">PAMANTASAN NG CABUYAO</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
