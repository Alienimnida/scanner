import { Lock, Unlock, Database, Server, AlertTriangle } from 'lucide-react';
import type { NetworkCall, ScanResult } from '../../types/cyberscope';
import { formatBytes, getStatusColor, getMethodColor } from '../../utils/formatters';
import { EmptyState } from './EmptyState';

interface NetworkAnalysisProps {
  networkCalls: NetworkCall[];
  networkSummary: ScanResult['networkSummary'];
}

export const NetworkAnalysis = ({ networkCalls, networkSummary }: NetworkAnalysisProps) => {
  if (!networkCalls || networkCalls.length === 0) {
    return (
      <EmptyState
        icon={<Server className="w-16 h-16 text-gray-600" />}
        title="Network monitoring not available"
        description="Network call tracking is not currently implemented in the scanning API."
      />
    );
  }

  return (
    <div className="space-y-6">
      {networkSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-950/30 p-4 rounded-lg border border-green-600">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-400">{networkSummary.secure}</p>
                <p className="text-sm text-green-200">Secure (HTTPS)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-950/30 p-4 rounded-lg border border-red-600">
            <div className="flex items-center gap-3">
              <Unlock className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-400">{networkSummary.insecure}</p>
                <p className="text-sm text-red-200">Insecure (HTTP)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-600">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-400">{formatBytes(networkSummary.totalSize)}</p>
                <p className="text-sm text-blue-200">Total Transfer</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {networkCalls.map((call, index) => (
          <div key={index} className="bg-gray-750 p-6 rounded-lg border border-gray-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${call.secure ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {call.secure ? (
                    <Lock className="w-5 h-5 text-green-400" />
                  ) : (
                    <Unlock className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getMethodColor(call.method)}`}>
                      {call.method}
                    </span>
                    <span className={`font-medium ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                    <span className="text-gray-400 text-sm">{call.timing}ms</span>
                  </div>
                  <p className="text-white break-all">{call.url}</p>
                  <p className="text-sm text-gray-400">
                    {call.domain} • {call.type} • {formatBytes(call.size)}
                  </p>
                </div>
              </div>
            </div>
            
            {!call.secure && (
              <div className="bg-red-950/50 border border-red-600 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-200 text-sm font-medium">
                    Insecure connection detected - Data transmitted over HTTP
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};