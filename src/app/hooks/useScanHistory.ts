import { useState, useEffect } from 'react';
import { ScanHistoryItem, ScanResult } from '@/app/types/cyberscope';

export function useScanHistory(userId?: string) {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = async (offset = 0, limit = 20) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`/api/scan/history?${params}`);
      const data = await response.json();

      if (offset === 0) {
        setHistory(data.history);
      } else {
        setHistory(prev => [...prev, ...data.history]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScanResult = async (id: string): Promise<ScanResult | null> => {
    try {
      const response = await fetch(`/api/scan/history/${id}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error loading scan result:', error);
      return null;
    }
  };

  const deleteScanResult = async (id: string) => {
    try {
      const response = await fetch(`/api/scan/history/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting scan result:', error);
      return false;
    }
  };

  const addToHistory = (scanResult: ScanResult) => {
    const historyItem: ScanHistoryItem = {
      id: scanResult.id!,
      url: scanResult.url,
      timestamp: scanResult.timestamp,
      totalScripts: scanResult.totalScripts,
      totalCredentials: scanResult.totalCredentials,
      seoScore: scanResult.seoAnalysis.score,
      title: scanResult.seoAnalysis.data.title,
      status: 'completed',
      userId: scanResult.userId,
    };

    setHistory(prev => [historyItem, ...prev]);
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return {
    history,
    loading,
    hasMore,
    fetchHistory,
    loadScanResult,
    deleteScanResult,
    addToHistory,
    refresh: () => fetchHistory(0),
  };
}