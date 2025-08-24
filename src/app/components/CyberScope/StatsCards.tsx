import { FileText, AlertTriangle, Wifi, Clock } from 'lucide-react';
import type { ScanResult } from '../../types/cyberscope';

interface StatsCardsProps {
  result: ScanResult;
}

export const StatsCards = ({ result }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{result.totalScripts}</p>
            <p className="text-sm text-gray-400">Scripts Found</p>
          </div>
        </div>
      </div>
      
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{result.totalCredentials}</p>
            <p className="text-sm text-gray-400">Credentials Found</p>
          </div>
        </div>
      </div>

      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Wifi className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{result.totalNetworkCalls || 0}</p>
            <p className="text-sm text-gray-400">Network Calls</p>
          </div>
        </div>
      </div>

      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Last Scan</p>
            <p className="text-xs text-gray-400">{new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};