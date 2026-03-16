'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface QuizHistoryItem {
  id: number;
  topic: string;
  difficulty: string;
  num_questions: number;
  created_at: string;
}

interface QuizHistoryProps {
  onBack: () => void;
}

export default function QuizHistory({ onBack }: QuizHistoryProps) {
  const [quizzes, setQuizzes] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/quizzes/`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz history');
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'hard':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Quiz History</h2>
        <p className="text-slate-400">View all quizzes you've created</p>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors text-sm"
      >
        ← Back to Home
      </button>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading quiz history...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && quizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No quizzes yet</h3>
          <p className="text-slate-400">Create your first quiz to get started!</p>
        </div>
      )}

      {/* Quiz List */}
      {!loading && !error && quizzes.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-slate-400 mb-4">
            Total quizzes: <span className="font-bold text-white">{quizzes.length}</span>
          </div>

          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{quiz.topic}</h3>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </span>
                    <span className="text-sm text-slate-400">
                      📝 {quiz.num_questions} questions
                    </span>
                    <span className="text-sm text-slate-400">
                      📅 {formatDate(quiz.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">#{quiz.id}</div>
                  <p className="text-xs text-slate-400">Quiz ID</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && !error && quizzes.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
            <div className="text-2xl font-bold text-blue-400">{quizzes.length}</div>
            <div className="text-sm text-slate-400 mt-1">Total Quizzes</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
            <div className="text-2xl font-bold text-green-400">
              {quizzes.filter((q) => q.difficulty.toLowerCase() === 'easy').length}
            </div>
            <div className="text-sm text-slate-400 mt-1">Easy</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
            <div className="text-2xl font-bold text-yellow-400">
              {quizzes.filter((q) => q.difficulty.toLowerCase() === 'medium').length}
            </div>
            <div className="text-sm text-slate-400 mt-1">Medium</div>
          </div>
        </div>
      )}
    </div>
  );
}
