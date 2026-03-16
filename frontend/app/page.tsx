'use client';

import { useState } from 'react';
import QuizForm from '@/components/QuizForm';
import QuizTaking from '@/components/QuizTaking';
import QuizResults from '@/components/QuizResults';
import QuizHistory from '@/components/QuizHistory';

type PageState = 'home' | 'taking' | 'results' | 'history';

interface QuizData {
  id: number;
  topic: string;
  difficulty: string;
  num_questions: number;
  questions: Array<{
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }>;
}

interface ResultsData {
  score: number;
  total: number;
  attemptId: number;
  quizId: number;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);

  const handleQuizGenerated = (quiz: QuizData) => {
    setCurrentQuiz(quiz);
    setCurrentPage('taking');
  };

  const handleQuizSubmitted = (resultData: ResultsData) => {
    setResults(resultData);
    setCurrentPage('results');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCurrentQuiz(null);
    setResults(null);
  };

  const handleViewHistory = () => {
    setCurrentPage('history');
  };

  const handleBackFromHistory = () => {
    setCurrentPage('home');
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AI Quiz App
          </h1>
          <p className="text-slate-400 text-lg">Generate AI-powered quizzes and track your performance</p>
        </div>

        {/* Navigation */}
        {currentPage === 'home' && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Create Quiz
            </button>
            <button
              onClick={handleViewHistory}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              Quiz History
            </button>
          </div>
        )}

        {/* Content */}
        {currentPage === 'home' && <QuizForm onQuizGenerated={handleQuizGenerated} />}
        {currentPage === 'taking' && currentQuiz && (
          <QuizTaking quiz={currentQuiz} onQuizSubmitted={handleQuizSubmitted} />
        )}
        {currentPage === 'results' && results && (
          <QuizResults results={results} onBackToHome={handleBackToHome} />
        )}
        {currentPage === 'history' && <QuizHistory onBack={handleBackFromHistory} />}
      </div>
    </main>
  );
}
