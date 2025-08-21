import { Globe, Zap } from 'lucide-react';

interface ScanInputProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  onScan: () => void;
}

export const ScanInput = ({ url, setUrl, loading, onScan }: ScanInputProps) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 -mt-10 mb-6 border border-gray-700">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-white placeholder-gray-400"
            disabled={loading}
          />
        </div>
        <button
          onClick={onScan}
          disabled={loading || !url.trim()}
          className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Scanning...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Scan Website
            </div>
          )}
        </button>
      </div>
    </div>
  );
};