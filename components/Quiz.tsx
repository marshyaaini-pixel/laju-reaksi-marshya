import React, { useState } from 'react';
import { Question, QuizResult } from '../types';
import { CheckCircle, XCircle, ArrowRight, Save } from 'lucide-react';
import { saveQuizResult } from '../services/storageService';

interface QuizProps {
  moduleId: string;
  questions: Question[];
  onComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ moduleId, questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<{questionId: string, selectedIndex: number, isCorrect: boolean}[]>([]);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [studentName, setStudentName] = useState('');

  const currentQuestion = questions[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) setScore(s => s + 1);

    const newResult = {
      questionId: currentQuestion.id,
      selectedIndex: idx,
      isCorrect
    };
    setResults([...results, newResult]);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
    }
  };

  const handleSave = () => {
    if (!studentName.trim()) {
      alert("Masukkan nama anda untuk menyimpan nilai.");
      return;
    }
    const finalResult: QuizResult = {
      studentName,
      moduleId,
      score: (score / questions.length) * 100,
      timestamp: new Date().toISOString(),
      answers: results
    };
    saveQuizResult(finalResult);
    onComplete();
  };

  if (showSummary) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md mx-auto mt-8">
        <h3 className="text-2xl font-bold mb-4">Kuis Selesai!</h3>
        <div className="text-6xl font-black text-indigo-600 mb-4">{finalScore}</div>
        <p className="text-gray-600 mb-6">Kamu menjawab {score} dari {questions.length} soal dengan benar.</p>
        
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Siswa</label>
          <input 
            type="text" 
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Ketik nama lengkap..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          <Save className="w-5 h-5" />
          Simpan Nilai
        </button>
      </div>
    );
  }

  if (!currentQuestion) return <div>No questions available.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Soal {currentIdx + 1} dari {questions.length}
        </span>
        <span className="text-sm text-gray-500">Skor Sementara: {score}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((opt, idx) => {
          let styles = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
          if (isAnswered) {
             if (idx === currentQuestion.correctIndex) styles = "bg-green-50 border-green-500 text-green-700";
             else if (idx === selectedOption) styles = "bg-red-50 border-red-500 text-red-700";
             else styles = "border-gray-200 opacity-50";
          } else if (selectedOption === idx) {
             styles = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${styles}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4 border border-blue-100">
            <strong>Penjelasan:</strong> {currentQuestion.explanation}
          </div>
          <div className="flex justify-end">
            <button 
              onClick={nextQuestion}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {currentIdx === questions.length - 1 ? 'Lihat Hasil' : 'Lanjut'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
