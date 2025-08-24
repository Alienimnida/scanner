import { Globe, Zap, Eye, Search } from "lucide-react";

interface ScanInputProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  onScan: () => void;
}

export const ScanInput = ({ url, setUrl, loading, onScan }: ScanInputProps) => {
  return (
    <div className="mb-8 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
      <div className="glass-effect rounded-2xl p-8 border border-gray-800 card-hover">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-gray-900/50 px-4 py-2 rounded-full mb-4 border border-gray-700">
            <Eye className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">SECURITY ANALYSIS</span>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Scan Your Application</h2>
          <p className="text-gray-400">Enter a URL to perform comprehensive security and SEO analysis</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
              disabled={loading}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          
          <button
            onClick={onScan}
            disabled={loading || !url.trim()}
            className="group px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 hover:border-gray-400 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Zap className="h-5 w-5 group-hover:text-yellow-400 transition-colors" />
            )}
            <span>{loading ? 'Scanning...' : 'Scan Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};