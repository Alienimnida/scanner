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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock size={20} />
          Scan History
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && history.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Loading scan history...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No scans match your search.' : 'No scan history found.'}
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleLoadScan(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.title || 'Untitled Page'}
                    </h3>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {item.url}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        {item.totalScripts} scripts
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield size={12} />
                        {item.totalCredentials} creds
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        SEO: {item.seoScore}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {loadingId === item.id && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    )}
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}