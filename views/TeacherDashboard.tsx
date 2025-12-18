import React, { useEffect, useState } from 'react';
import { getQuizResults, seedInitialData } from '../services/storageService';
import { QuizResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyzeStudentPerformance } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    seedInitialData();
    const data = getQuizResults();
    setResults(data);
  }, []);

  const handleAnalyze = async () => {
    setIsLoadingAnalysis(true);
    const analysis = await analyzeStudentPerformance(results);
    setAiAnalysis(analysis);
    setIsLoadingAnalysis(false);
  };

  // Process data for charts
  const avgScores = results.reduce((acc: any, curr) => {
    if (!acc[curr.moduleId]) {
      acc[curr.moduleId] = { moduleId: curr.moduleId, total: 0, count: 0 };
    }
    acc[curr.moduleId].total += curr.score;
    acc[curr.moduleId].count += 1;
    return acc;
  }, {});

  const chartData = Object.keys(avgScores).map(key => ({
    name: key === 'mod-1' ? 'Konsep' : key === 'mod-2' ? 'Teori Tumbukan' : 'Faktor',
    score: Math.round(avgScores[key].total / avgScores[key].count)
  }));

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Guru</h1>
        <p className="text-gray-600">Monitoring perkembangan siswa dan analisis nilai.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-6">Rata-rata Nilai per Modul</h2>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#4f46e5" name="Nilai Rata-rata" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-indigo-900">AI Assistant Analysis</h2>
          </div>
          
          <div className="min-h-[150px] text-sm text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg">
            {aiAnalysis ? (
              <p>{aiAnalysis}</p>
            ) : (
              <p className="text-gray-500 italic">Klik tombol di bawah untuk mendapatkan analisis performa kelas menggunakan Gemini AI.</p>
            )}
            {isLoadingAnalysis && <p className="mt-2 text-indigo-600 animate-pulse">Sedang menganalisis data...</p>}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoadingAnalysis}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Analisis Sekarang
          </button>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Log Aktivitas Siswa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Nama Siswa</th>
                <th className="px-6 py-3 font-medium">Modul</th>
                <th className="px-6 py-3 font-medium">Nilai</th>
                <th className="px-6 py-3 font-medium">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada data siswa.</td>
                </tr>
              ) : (
                results.slice().reverse().map((r, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.studentName}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {r.moduleId === 'mod-1' ? 'Konsep' : r.moduleId === 'mod-2' ? 'Teori Tumbukan' : 'Faktor'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${r.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(r.timestamp).toLocaleDateString()} {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
