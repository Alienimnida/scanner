import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function SEOScore({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-400" />;
    if (score >= 60) return <AlertCircle className="w-8 h-8 text-yellow-400" />;
    return <XCircle className="w-8 h-8 text-red-400" />;
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getScoreIcon(score)}
          <div>
            <h3 className="text-lg font-semibold text-gray-100">SEO Score</h3>
            <p className="text-sm text-gray-400">Overall optimization rating</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-lg text-gray-300">
            {getScoreGrade(score)} Grade
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-400' : 
              score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}