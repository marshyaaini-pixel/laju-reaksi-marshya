import React, { useState } from 'react';
import { Module, Question, ChatMessage } from '../types';
import { askChemistryTutor } from '../services/geminiService';
import Simulation from '../components/Simulation';
import Quiz from '../components/Quiz';
import { Bot, Send, ArrowLeft, BookOpen, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  module: Module;
  quizQuestions: Question[];
  onBack: () => void;
}

const StudentModule: React.FC<Props> = ({ module, quizQuestions, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Saya asisten lab kimiamu. Ada yang belum paham tentang materi ini?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputMsg };
    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    const answer = await askChemistryTutor(userMsg.text, module.content);
    
    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
          <p className="text-sm text-gray-500">Modul Pembelajaran</p>
        </div>
        <div className="ml-auto flex gap-2">
            <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${activeTab === 'content' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
                <BookOpen className="w-4 h-4" /> Materi
            </button>
            <button 
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
                <BrainCircuit className="w-4 h-4" /> Kuis
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex gap-6">
        <div className="flex-1 overflow-y-auto pr-2 pb-20">
            {activeTab === 'content' ? (
                <div className="space-y-8 animate-fade-in">
                    {/* Text Content */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose prose-indigo max-w-none">
                        <ReactMarkdown>{module.content}</ReactMarkdown>
                    </div>

                    {/* Simulation Embed */}
                    <Simulation />
                </div>
            ) : (
                <div className="animate-fade-in">
                    <Quiz 
                        moduleId={module.id} 
                        questions={quizQuestions} 
                        onComplete={() => console.log("Quiz Finished")} 
                    />
                </div>
            )}
        </div>

        {/* Chat Widget (Fixed or Sticky) */}
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none`}>
            {chatOpen && (
                <div className="pointer-events-auto bg-white w-80 h-96 shadow-2xl rounded-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden">
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                        <h3 className="font-semibold flex items-center gap-2"><Bot className="w-4 h-4" /> AI Tutor</h3>
                        <button onClick={() => setChatOpen(false)} className="text-indigo-200 hover:text-white">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                    m.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-gray-400 ml-2">AI sedang mengetik...</div>}
                    </div>
                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            type="text"
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Tanya sesuatu..."
                            className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={isTyping}
                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            
            <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-semibold"
            >
                <Bot className="w-6 h-6" />
                {!chatOpen && <span className="pr-2">Tanya AI</span>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModule;
