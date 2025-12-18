export interface Module {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or text content
  order: number;
}

export interface Question {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  studentName: string;
  moduleId: string;
  score: number;
  timestamp: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
