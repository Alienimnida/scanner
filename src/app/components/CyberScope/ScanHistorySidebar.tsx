"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Clock,
  FileText,
  Shield,
  TrendingUp,
  Trash2,
  ChevronDown,
  Search,
  X,
  User,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useScanHistory } from "@/app/hooks/useScanHistory";
import { ScanHistoryItem, ScanResult } from "@/app/types/cyberscope";
import { UserProfileDropdown } from "./UserProfileDropdown";

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
  userId,
}: ScanHistorySidebarProps) {
  const { user } = useUser();
  const { history, loading, hasMore, fetchHistory, loadScanResult, deleteScanResult } =
    useScanHistory(userId);

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const filteredHistory = history.filter(
    (item) =>
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
    if (confirm("Are you sure you want to delete this scan result?")) {
      await deleteScanResult(id);
    }
  };

  const loadMore = () => {
    fetchHistory(history.length);
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-900/40";
    if (score >= 60) return "text-yellow-400 bg-yellow-900/40";
    return "text-red-400 bg-red-900/40";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-black border-2 border-cyan-400 z-50 flex flex-col transform transition-transform duration-300 ease-out shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-3">
          <div className="p-2 bg-blue-900/40 rounded-lg">
            <Clock size={20} className="text-blue-400" />
          </div>
          Scan History
        </h2>

        <div className="flex items-center gap-3">
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-800 rounded-lg transition-all"
              >
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="w-8 h-8 rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-400" />
                  </div>
                )}
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showUserDropdown && (
                <UserProfileDropdown
                  user={user}
                  onClose={() => setShowUserDropdown(false)}
                />
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <X size={20} className="text-gray-400 hover:text-gray-200" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 border-b border-gray-800">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by URL or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-4" />
            <p className="text-sm">Loading scan history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Clock size={28} className="mb-3 text-gray-600" />
            <p className="text-sm">
              {searchTerm ? (
                <>
                  No scans match{" "}
                  <span className="font-semibold text-gray-300">
                    "{searchTerm}"
                  </span>
                </>
              ) : (
                "No scan history found"
              )}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
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
                className="group bg-gray-800/60 border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                onClick={() => handleLoadScan(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-200 text-sm truncate group-hover:text-blue-400">
                        {item.title || "Untitled Page"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate font-mono">
                        {item.url}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs bg-gray-700/50 rounded-lg px-2 py-1.5">
                        <FileText size={12} className="text-gray-400" />
                        <span className="font-medium text-gray-300">
                          {item.totalScripts}
                        </span>
                        <span className="text-gray-500">scripts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-gray-700/50 rounded-lg px-2 py-1.5">
                        <Shield size={12} className="text-gray-400" />
                        <span className="font-medium text-gray-300">
                          {item.totalCredentials}
                        </span>
                        <span className="text-gray-500">creds</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1.5 ${getSeoScoreColor(
                          item.seoScore
                        )}`}
                      >
                        <TrendingUp size={12} />
                        <span className="font-bold">{item.seoScore}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      {format(new Date(item.timestamp), "MMM dd, yyyy • HH:mm")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {loadingId === item.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                    ) : (
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition"
                        title="Delete scan"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg disabled:text-gray-500 disabled:border-gray-800 transition"
                >
                  {loading ? "Loading more..." : "Load More Scans"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
