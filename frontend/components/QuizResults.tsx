'use client';

interface ResultsData {
  score: number;
  total: number;
  attemptId: number;
  quizId: number;
}

interface QuizResultsProps {
  results: ResultsData;
  onBackToHome: () => void;
}

export default function QuizResults({ results, onBackToHome }: QuizResultsProps) {
  const percentage = Math.round((results.score / results.total) * 100);
  
  const getPerformanceLevel = (percent: number) => {
    if (percent >= 90) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-900/30' };
    if (percent >= 75) return { level: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-900/30' };
    if (percent >= 60) return { level: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30' };
    return { level: 'Needs Improvement', color: 'text-red-400', bgColor: 'bg-red-900/30' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-slate-400">Here's how you performed</p>
      </div>

      {/* Score Display */}
      <div className={`${performance.bgColor} border border-slate-600 rounded-lg p-8 mb-8 text-center`}>
        <div className="mb-6">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
                className={performance.color}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-bold ${performance.color}`}>{percentage}%</div>
              <div className="text-slate-400 text-sm">Score</div>
            </div>
          </div>
        </div>

        <h3 className={`text-2xl font-bold ${performance.color} mb-2`}>
          {performance.level}
        </h3>
        <p className="text-slate-300 text-lg">
          You scored <span className="font-bold">{results.score}</span> out of{' '}
          <span className="font-bold">{results.total}</span> questions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
          <div className="text-2xl font-bold text-green-400">{results.score}</div>
          <div className="text-sm text-slate-400 mt-1">Correct</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
          <div className="text-2xl font-bold text-red-400">{results.total - results.score}</div>
          <div className="text-sm text-slate-400 mt-1">Incorrect</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
          <div className="text-2xl font-bold text-blue-400">{results.total}</div>
          <div className="text-sm text-slate-400 mt-1">Total</div>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 mb-8">
        <h4 className="font-semibold mb-3">Feedback</h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          {percentage >= 90
            ? '🎉 Outstanding performance! You have mastered this topic. Consider taking a more challenging quiz.'
            : percentage >= 75
            ? '👍 Great job! You have a solid understanding of this topic. Keep practicing to improve further.'
            : percentage >= 60
            ? '📚 Good effort! Review the topics you found challenging and try again to improve your score.'
            : '💪 Keep learning! Review the material and try again. Every attempt helps you improve.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBackToHome}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          Take Another Quiz
        </button>
        <button
          onClick={onBackToHome}
          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </button>
      </div>

      {/* Details */}
      <div className="mt-8 bg-slate-700/30 rounded-lg p-4 border border-slate-600 text-xs text-slate-400">
        <p>Attempt ID: <span className="font-mono text-slate-300">{results.attemptId}</span></p>
        <p className="mt-1">Quiz ID: <span className="font-mono text-slate-300">{results.quizId}</span></p>
      </div>
    </div>
  );
}
