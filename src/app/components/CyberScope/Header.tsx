import { Target, Clock } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-8 shadow-2xl">
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Target className="w-10 h-10 text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">CyberScope</h1>
            <p className="text-cyan-200 text-sm">Advanced Web Security Scanner</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 text-white border border-white/20 hover:border-white/30"
          >
            <Clock size={18} className="text-cyan-400" />
            <span className="text-sm font-medium">Scan History</span>
          </button>
        </div>
      </div>
    </div>
  );
};