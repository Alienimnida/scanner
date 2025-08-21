import { useState } from 'react';
import { X, Shield, Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';

interface VerificationInstructions {
  token: string;
  instructions: {
    dns: string;
    html: string;
    file: string;
  };
}

interface DomainVerificationProps {
  domain: string | null;
  verificationInstructions: VerificationInstructions | null;
  verificationLoading: boolean;
  onGenerateToken: (domain?: string) => void;
  onCheckVerification: (targetUrl?: string) => Promise<boolean>;
  onCancel: () => void;
}

export function DomainVerification({
  domain,
  verificationInstructions,
  verificationLoading,
  onGenerateToken,
  onCheckVerification,
  onCancel
}: DomainVerificationProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'dns' | 'html' | 'file'>('dns');

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const methods = [
    { 
      key: 'dns' as const, 
      label: 'DNS Record', 
      description: 'Add a TXT record to your DNS',
      icon: '🌐'
    },
    { 
      key: 'html' as const, 
      label: 'HTML Meta Tag', 
      description: 'Add a meta tag to your homepage',
      icon: '🏷️'
    },
    { 
      key: 'file' as const, 
      label: 'HTML File', 
      description: 'Upload a verification file',
      icon: '📄'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-gray-100">Domain Verification Required</h2>
              <p className="text-gray-400 text-sm">
                Verify ownership of <span className="font-mono text-blue-400">{domain}</span> to proceed
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-200 font-medium mb-1">Why is verification required?</p>
              <p className="text-yellow-100/80">
                This domain requires ownership verification to prevent unauthorized scanning. 
                This protects website owners from potential security analysis without consent.
              </p>
            </div>
          </div>

          {!verificationInstructions ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Generate Verification Token
              </h3>
              <p className="text-gray-400 mb-6">
                Click below to generate a unique verification token for your domain.
              </p>
              <button
                onClick={() => onGenerateToken()}
                disabled={verificationLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                {verificationLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {verificationLoading ? 'Generating...' : 'Generate Token'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Choose Your Verification Method
                </h3>
                <p className="text-gray-400">
                  Complete one of the following verification methods to prove domain ownership.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {methods.map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setSelectedMethod(method.key)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedMethod === method.key
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-medium text-gray-100 mb-1">{method.label}</div>
                    <div className="text-sm text-gray-400">{method.description}</div>
                  </button>
                ))}
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                {selectedMethod === 'dns' && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-3 flex items-center gap-2">
                      🌐 DNS Verification
                    </h4>
                    <p className="text-gray-300 mb-4">
                      Add the following TXT record to your DNS settings:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Record Type:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-800 px-3 py-1 rounded text-green-400 font-mono">
                            TXT
                          </code>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Host/Name:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-800 px-3 py-1 rounded text-blue-400 font-mono flex-1">
                            {domain}
                          </code>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Value:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-800 px-3 py-1 rounded text-yellow-400 font-mono flex-1 break-all">
                            {verificationInstructions.instructions.dns}
                          </code>
                          <button
                            onClick={() => copyToClipboard(verificationInstructions.instructions.dns, 'dns')}
                            className="p-2 hover:bg-gray-600 rounded transition-colors"
                          >
                            {copiedField === 'dns' ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'html' && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-3 flex items-center gap-2">
                      🏷️ HTML Meta Tag Verification
                    </h4>
                    <p className="text-gray-300 mb-4">
                      Add the following meta tag to the &lt;head&gt; section of your homepage:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-800 px-3 py-1 rounded text-green-400 font-mono flex-1 break-all">
                        {verificationInstructions.instructions.html}
                      </code>
                      <button
                        onClick={() => copyToClipboard(verificationInstructions.instructions.html, 'html')}
                        className="p-2 hover:bg-gray-600 rounded transition-colors"
                      >
                        {copiedField === 'html' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'file' && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-3 flex items-center gap-2">
                      📄 HTML File Verification
                    </h4>
                    <p className="text-gray-300 mb-4">
                      Create an HTML file and upload it to your website root:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          File URL:
                        </label>
                        <code className="block bg-gray-800 px-3 py-1 rounded text-blue-400 font-mono">
                          https://{domain}/cyberscope-verification.html
                        </code>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          File Content:
                        </label>
                        <div className="flex items-start gap-2">
                          <code className="bg-gray-800 px-3 py-2 rounded text-green-400 font-mono flex-1 whitespace-pre-wrap">
                            {verificationInstructions.instructions.file}
                          </code>
                          <button
                            onClick={() => copyToClipboard(verificationInstructions.instructions.file, 'file')}
                            className="p-2 hover:bg-gray-600 rounded transition-colors"
                          >
                            {copiedField === 'file' ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onCheckVerification()}
                  disabled={verificationLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {verificationLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {verificationLoading ? 'Verifying...' : 'Verify Domain'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}