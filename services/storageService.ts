import { QuizResult } from '../types';

const RESULT_KEY = 'reaction_lab_results';

export const saveQuizResult = (result: QuizResult) => {
  const existing = getQuizResults();
  const updated = [...existing, result];
  localStorage.setItem(RESULT_KEY, JSON.stringify(updated));
};

export const getQuizResults = (): QuizResult[] => {
  const data = localStorage.getItem(RESULT_KEY);
  return data ? JSON.parse(data) : [];
};

// Seed some fake data for the teacher view if empty
export const seedInitialData = () => {
  if (getQuizResults().length === 0) {
    const mockData: QuizResult[] = [
      {
        studentName: 'Ahmad Santoso',
        moduleId: 'mod-1',
        score: 100,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        answers: []
      },
      {
        studentName: 'Siti Aminah',
        moduleId: 'mod-1',
        score: 50,
        timestamp: new Date(Date.now() - 80000000).toISOString(),
        answers: []
      },
      {
        studentName: 'Budi Hartono',
        moduleId: 'mod-2',
        score: 75,
        timestamp: new Date(Date.now() - 40000000).toISOString(),
        answers: []
      }
    ];
    localStorage.setItem(RESULT_KEY, JSON.stringify(mockData));
  }
};
