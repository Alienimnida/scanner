import { ExternalLink, FileText, AlertTriangle, Eye } from 'lucide-react';
import type { ScannedScript } from '../../types/cyberscope';
import { formatBytes, getCredentialIcon, getCredentialColor } from '../../utils/formatters';
import { EmptyState } from  './EmptyState';

interface ScriptAnalysisProps {
  scripts: ScannedScript[];
}

export const ScriptAnalysis = ({ scripts }: ScriptAnalysisProps) => {
  if (scripts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-16 h-16 text-gray-600" />}
        title="No JavaScript files detected"
        description="The website may not use JavaScript or all scripts were filtered."
      />
    );
  }

  return (
    <div className="space-y-6">
      {scripts.map((script, index) => (
        <div key={index} className="bg-gray-750 p-6 rounded-lg border border-gray-600">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {script.type === 'external' ? (
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-blue-400" />
                </div>
              ) : (
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">
                  {script.type === 'external' ? 'External Script' : 'Inline Script'}
                </h3>
                <p className="text-sm text-gray-400 break-all max-w-2xl">
                  {script.url}
                </p>
              </div>
            </div>
            {script.size && (
              <span className="bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded-full">
                {formatBytes(script.size)}
              </span>
            )}
          </div>

          {script.credentials && script.credentials.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-medium text-red-300">
                  {script.credentials.length} Credential(s) Exposed
                </span>
              </div>
              <div className="space-y-3">
                {script.credentials.map((cred, credIndex) => (
                  <div key={credIndex} className={`p-4 rounded-lg border-2 ${getCredentialColor(cred.type)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getCredentialIcon(cred.type)}
                      <span className="font-semibold text-white">{cred.type}</span>
                      <span className="text-sm text-gray-400">Line {cred.line}</span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-300 mb-1">Exposed Value:</p>
                      <code className="bg-gray-800 px-3 py-2 rounded text-sm text-red-300 font-mono block">
                        {cred.value}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Context:</p>
                      <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-x-auto font-mono border border-gray-600">
                        {cred.context}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {script.content && (
            <details className="mt-4">
              <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Script Content
              </summary>
              <div className="mt-3 border border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-700 text-gray-200 px-4 py-2 text-sm border-b border-gray-600">
                  Script Content {script.content.length > 1000 && '(truncated)'}
                </div>
                <pre className="p-4 bg-gray-900 text-green-300 text-xs overflow-auto max-h-64 font-mono">
                  {script.content.substring(0, 1000)}
                  {script.content.length > 1000 && '\n\n... (content truncated for display)'}
                </pre>
              </div>
            </details>
          )}
        </div>
      ))}
    </div>
  );
};