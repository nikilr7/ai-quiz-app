'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface QuizFormProps {
  onQuizGenerated: (quiz: any) => void;
}

export default function QuizForm({ onQuizGenerated }: QuizFormProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-quiz/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          num_questions: numQuestions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const generatedQuiz = await response.json();
      
      // The response now includes the full quiz with questions
      onQuizGenerated(generatedQuiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6">Create a New Quiz</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-2">
            Quiz Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Python Programming, World History, Biology"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            required
          />
          <p className="text-xs text-slate-400 mt-1">Enter any topic you'd like to be quizzed on</p>
        </div>

        {/* Difficulty Level */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium mb-2">
            Number of Questions: {numQuestions}
          </label>
          <input
            id="numQuestions"
            type="range"
            min="5"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>5 questions</span>
            <span>20 questions</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating Quiz...
            </span>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
        <h3 className="font-semibold text-sm mb-2">How it works:</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>✓ Enter a topic you want to learn about</li>
          <li>✓ Choose your preferred difficulty level</li>
          <li>✓ Select the number of questions</li>
          <li>✓ AI generates unique multiple-choice questions</li>
          <li>✓ Take the quiz and get instant results</li>
        </ul>
      </div>
    </div>
  );
}
