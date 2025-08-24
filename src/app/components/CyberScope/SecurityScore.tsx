import { Activity } from 'lucide-react';
import { getSecurityScore, getSecurityLabel } from '@/app/utils/formatters';
import type { ScanResult } from '../../types/cyberscope';

interface SecurityScoreProps {
  result: ScanResult;
}

export const SecurityScore = ({ result }: SecurityScoreProps) => {
  const score = getSecurityScore(result.totalScripts, result.totalCredentials, result.networkSummary);
  const { label, color, icon } = getSecurityLabel(score);

  return (
    <div className="bg-black p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-6 h-6 text-cyan-400" />
        Security Assessment
      </h2>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 font-medium ${color}`}>
          {icon} {label}
        </div>
        <span className="font-bold text-white text-xl">{score.toFixed(0)}%</span>
      </div>
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ${
            score > 80 
              ? 'bg-gradient-to-r from-green-500 to-green-400' 
              : score > 50 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
                : 'bg-gradient-to-r from-red-500 to-red-400'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};