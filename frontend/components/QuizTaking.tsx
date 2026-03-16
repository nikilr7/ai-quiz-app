'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface Quiz {
  id: number;
  topic: string;
  difficulty: string;
  num_questions: number;
  questions: Question[];
}

interface QuizTakingProps {
  quiz: Quiz;
  onQuizSubmitted: (results: any) => void;
}

export default function QuizTaking({ quiz, onQuizSubmitted }: QuizTakingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (option: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Format answers for submission
      const formattedAnswers = quiz.questions.map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id] || '',
      }));

      const response = await fetch(`${API_BASE_URL}/submit-quiz/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: quiz.id,
          answers: formattedAnswers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }

      const data = await response.json();
      onQuizSubmitted({
        score: data.score,
        total: data.total,
        attemptId: data.attempt_id,
        quizId: quiz.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const optionsMap = [
    { key: 'A', value: currentQuestion.option_a },
    { key: 'B', value: currentQuestion.option_b },
    { key: 'C', value: currentQuestion.option_c },
    { key: 'D', value: currentQuestion.option_d },
  ];

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{quiz.topic}</h2>
            <p className="text-slate-400 text-sm mt-1">
              Difficulty: <span className="capitalize font-semibold text-blue-400">{quiz.difficulty}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-400">
              {currentQuestionIndex + 1}/{quiz.questions.length}
            </p>
            <p className="text-slate-400 text-sm">Questions</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-white">
          {currentQuestion.question_text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {optionsMap.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelectAnswer(option.key)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                answers[currentQuestion.id] === option.key
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-slate-600 bg-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-semibold ${
                    answers[currentQuestion.id] === option.key
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-500'
                  }`}
                >
                  {option.key}
                </div>
                <span>{option.value}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200 mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          ← Previous
        </button>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length < quiz.questions.length}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Submitting...
              </span>
            ) : (
              'Submit Quiz'
            )}
          </button>
        )}
      </div>

      {/* Answer Status */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
        <p className="text-sm text-slate-300">
          {Object.keys(answers).length} of {quiz.questions.length} questions answered
        </p>
        {Object.keys(answers).length < quiz.questions.length && (
          <p className="text-xs text-yellow-400 mt-1">
            ⚠ You must answer all questions before submitting
          </p>
        )}
      </div>
    </div>
  );
}
