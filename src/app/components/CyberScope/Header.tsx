import { Target } from 'lucide-react';

export const Header = () => {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-8 shadow-2xl">
      <div className="container mx-auto px-6 max-w-7xl flex items-center gap-3">
        <div className="relative">
          <Target className="w-10 h-10 text-cyan-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">CyberScope</h1>
          <p className="text-cyan-200 text-sm">Advanced Web Security Scanner</p>
        </div>
      </div>
    </div>
  );
};