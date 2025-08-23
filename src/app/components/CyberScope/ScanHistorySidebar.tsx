import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Clock, 
  FileText, 
  Shield, 
  TrendingUp, 
  Trash2, 
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { useScanHistory } from '@/app/hooks/useScanHistory';
import { ScanHistoryItem, ScanResult } from '@/app/types/cyberscope';

interface ScanHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScan: (scanResult: ScanResult) => void;
  userId?: string;
}

export function ScanHistorySidebar({ 
  isOpen, 
  onClose, 
  onLoadScan, 
  userId 
}: ScanHistorySidebarProps) {
  const {
    history,
    loading,
    hasMore,
    fetchHistory,
    loadScanResult,
    deleteScanResult,
  } = useScanHistory(userId);

  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredHistory = history.filter(item =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadScan = async (item: ScanHistoryItem) => {
    setLoadingId(item.id);
    try {
      const scanResult = await loadScanResult(item.id);
      if (scanResult) {
        onLoadScan(scanResult);
        onClose();
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scan result?')) {
      await deleteScanResult(id);
    }
  };

  const loadMore = () => {
    fetchHistory(history.length);
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock size={20} className="text-blue-600" />
            </div>
            Scan History
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200 group"
          >
            <X size={20} className="text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by URL or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-sm placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && history.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mb-4" />
              <p className="text-sm font-medium">Loading scan history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Clock size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-center">
                {searchTerm ? (
                  <>
                    No scans match <span className="font-semibold">"{searchTerm}"</span>
                  </>
                ) : (
                  'No scan history found'
                )}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                  onClick={() => handleLoadScan(item)}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 group-hover:from-blue-50/30 to-transparent transition-all duration-200" />
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      {/* Title and URL */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 group-hover:text-blue-800 transition-colors">
                          {item.title || 'Untitled Page'}
                        </h3>
                        <p className="text-xs text-gray-500 truncate font-mono bg-gray-50 px-2 py-1 rounded group-hover:bg-blue-50 transition-colors">
                          {item.url}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="flex items-center gap-1.5 text-xs bg-gray-50 rounded-lg px-2 py-1.5 group-hover:bg-blue-50 transition-colors">
                          <FileText size={12} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="font-medium text-gray-700">{item.totalScripts}</span>
                          <span className="text-gray-500">scripts</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs bg-gray-50 rounded-lg px-2 py-1.5 group-hover:bg-blue-50 transition-colors">
                          <Shield size={12} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="font-medium text-gray-700">{item.totalCredentials}</span>
                          <span className="text-gray-500">creds</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1.5 transition-colors ${getSeoScoreColor(item.seoScore)}`}>
                          <TrendingUp size={12} />
                          <span className="font-bold">{item.seoScore}%</span>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 font-medium">
                        {format(new Date(item.timestamp), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {loadingId === item.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                      ) : (
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete scan"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute left-0 top-0 w-1 h-0 bg-blue-500 group-hover:h-full transition-all duration-200 rounded-r" />
                </div>
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="pt-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full py-3 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-300 disabled:border-gray-200 transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                        Loading more...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <ChevronDown size={16} />
                        Load More Scans
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
