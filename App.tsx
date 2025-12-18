import React, { useState } from 'react';
import { Role } from './types';
import { MODULES, QUIZZES } from './constants';
import StudentModule from './views/StudentModule';
import TeacherDashboard from './views/TeacherDashboard';
import { FlaskConical, LayoutDashboard, LogOut, GraduationCap, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Simple Router Logic
  const renderContent = () => {
    if (!currentRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-8">
            <div className="flex justify-center">
              <div className="bg-indigo-100 p-4 rounded-full">
                <FlaskConical className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ReactionRate Lab</h1>
              <p className="text-gray-600">Portal pembelajaran Kimia interaktif SMA Kelas 11</p>
            </div>
            
            <div className="grid gap-4">
              <button 
                onClick={() => setCurrentRole(Role.STUDENT)}
                className="group relative flex items-center justify-center gap-3 w-full bg-white border-2 border-indigo-100 hover:border-indigo-600 p-4 rounded-xl transition-all hover:shadow-lg"
              >
                <GraduationCap className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition" />
                <div className="text-left">
                  <span className="block font-bold text-gray-900">Masuk sebagai Siswa</span>
                  <span className="text-xs text-gray-500">Akses materi, simulasi, dan kuis</span>
                </div>
              </button>

              <button 
                onClick={() => setCurrentRole(Role.TEACHER)}
                className="group relative flex items-center justify-center gap-3 w-full bg-white border-2 border-indigo-100 hover:border-indigo-600 p-4 rounded-xl transition-all hover:shadow-lg"
              >
                <LayoutDashboard className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition" />
                <div className="text-left">
                  <span className="block font-bold text-gray-900">Masuk sebagai Guru</span>
                  <span className="text-xs text-gray-500">Lihat rekap nilai & analisis AI</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentRole === Role.TEACHER) {
      return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-indigo-600" />
                    <span className="font-bold text-gray-800">Reaction Lab</span>
                </div>
                <div className="p-4">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </button>
                </div>
                <div className="mt-auto p-4 border-t border-gray-100">
                    <button onClick={() => setCurrentRole(null)} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition px-4 py-2">
                        <LogOut className="w-4 h-4" /> Keluar
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <TeacherDashboard />
            </main>
        </div>
      );
    }

    // STUDENT VIEW
    if (activeModuleId) {
      const module = MODULES.find(m => m.id === activeModuleId);
      const moduleQuestions = QUIZZES.filter(q => q.moduleId === activeModuleId);
      if (!module) return null;

      return (
        <div className="min-h-screen bg-gray-50 p-6">
            <StudentModule 
                module={module} 
                quizQuestions={moduleQuestions}
                onBack={() => setActiveModuleId(null)} 
            />
        </div>
      );
    }

    // Student Module Selection
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-indigo-100 rounded-lg">
                <FlaskConical className="w-5 h-5 text-indigo-600" />
             </div>
             <span className="font-bold text-xl text-gray-900">Materi Kimia</span>
          </div>
          <button onClick={() => setCurrentRole(null)} className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Keluar
          </button>
        </header>

        <main className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="bg-indigo-600 rounded-2xl p-8 text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-3xl font-bold mb-4">Selamat Belajar, Calon Ilmuwan!</h2>
                    <p className="text-indigo-100 mb-6">Pelajari bagaimana reaksi kimia terjadi, faktor apa saja yang mempengaruhinya, dan uji pemahamanmu dengan simulasi interaktif.</p>
                </div>
                <FlaskConical className="w-64 h-64 absolute -right-10 -bottom-10 text-indigo-500 opacity-50 rotate-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MODULES.map((mod) => (
                    <div key={mod.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
                        <div className="h-32 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                             {/* Simple generic decorative background */}
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
                             <PlayCircle className="w-12 h-12 text-indigo-300 group-hover:text-indigo-600 transition-colors transform group-hover:scale-110 duration-300" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">Modul {mod.order}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{mod.title}</h3>
                            <p className="text-gray-600 text-sm flex-1 mb-4">{mod.description}</p>
                            <button 
                                onClick={() => setActiveModuleId(mod.id)}
                                className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                            >
                                Mulai Belajar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
      </div>
    );
  };

  return renderContent();
};

export default App;
