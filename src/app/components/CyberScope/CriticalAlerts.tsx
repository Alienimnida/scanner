import { AlertOctagon, Key, Unlock } from 'lucide-react';
import type { ScanResult } from '../../types/cyberscope';

interface CriticalAlertsProps {
  result: ScanResult;
}

export const CriticalAlerts = ({ result }: CriticalAlertsProps) => {
  const hasCredentials = result.totalCredentials > 0;
  const hasInsecureConnections = result.networkSummary ? result.networkSummary.insecure > 0 : false;

  if (!hasCredentials && !hasInsecureConnections) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-500 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertOctagon className="w-6 h-6 text-red-400" />
        <h2 className="text-xl font-semibold text-red-200">Critical Security Issues Detected</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasCredentials && (
          <div className="bg-red-950/30 p-4 rounded-lg border border-red-600">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-red-400" />
              <span className="font-medium text-red-200">Exposed Credentials</span>
            </div>
            {Object.entries(result.credentialsSummary).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-300">{type}</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {hasInsecureConnections && result.networkSummary && (
          <div className="bg-orange-950/30 p-4 rounded-lg border border-orange-600">
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="w-5 h-5 text-orange-400" />
              <span className="font-medium text-orange-200">Insecure Connections</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">HTTP Requests</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {result.networkSummary.insecure}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};