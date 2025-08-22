'use client';
import { useState, useEffect } from 'react';
import { useCyberScan } from '../../hooks/useCyberScan';
import { Header } from './Header';
import { ScanInput } from './ScanInput';
import { SecurityScore } from './SecurityScore';
import { StatsCards } from './StatsCards';
import { CriticalAlerts } from './CriticalAlerts';
import { ScriptAnalysis } from './ScriptAnalysis';
import { NetworkAnalysis } from './NetworkAnalysis';
import { SEOAnalysis } from './SEOAnalysis';
import { TabNavigation } from '../ui/TabNavigation';
import { ErrorAlert } from '../ui/ErrorAlert';
import { DomainVerification } from './DomainVerification';
import { ScanHistorySidebar } from './ScanHistorySidebar';
import { useScanHistory } from '@/app/hooks/useScanHistory';
import type { TabType, ScanResult } from '../../types/cyberscope';

export default function CyberScope() {
  const {
    url,
    setUrl,
    loading,
    result,
    error,
    handleScan,
    verificationRequired,
    verificationInstructions,
    verificationLoading,
    domainToVerify,
    generateVerificationToken,
    checkVerification,
    resetVerification,
    loadPreviousScan,
    userId
  } = useCyberScan();

  const { addToHistory } = useScanHistory(userId);
  const [activeTab, setActiveTab] = useState<TabType>('scripts');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    {
      key: 'scripts' as TabType,
      label: `Script Analysis (${result?.totalScripts || 0})`,
      icon: 'FileText'
    },
    ...(result?.networkCalls && result.networkCalls.length > 0 ? [{
      key: 'network' as TabType,
      label: `Network Calls (${result?.totalNetworkCalls || 0})`,
      icon: 'Server'
    }] : []),
    ...(result?.seoAnalysis ? [{
      key: 'seo' as TabType,
      label: `SEO Analysis (${result.seoAnalysis.score || 0}/100)`,
      icon: 'TrendingUp'
    }] : [])
  ];

  // Effect to add successful scans to history
  useEffect(() => {
    if (result && result.id && !loading) {
      addToHistory(result);
    }
  }, [result, loading, addToHistory]);

  const handleLoadScan = (scanResult: ScanResult) => {
    // Load the previous scan result into the current state
    if (loadPreviousScan) {
      loadPreviousScan(scanResult);
    } else {
      console.warn('loadPreviousScan method not available in useCyberScan hook');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="container mx-auto p-6 max-w-7xl">
        <ScanInput
          url={url}
          setUrl={setUrl}
          loading={loading}
          onScan={handleScan}
        />

        {error && <ErrorAlert error={error} />}

        {verificationRequired && (
          <DomainVerification
            domain={domainToVerify}
            verificationInstructions={verificationInstructions}
            verificationLoading={verificationLoading}
            onGenerateToken={generateVerificationToken}
            onCheckVerification={checkVerification}
            onCancel={resetVerification}
          />
        )}

        {result && (
          <div className="space-y-6">
            <SecurityScore result={result} />
            <StatsCards result={result} />
            <CriticalAlerts result={result} />

            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              
              <div className="p-6">
                {activeTab === 'scripts' && <ScriptAnalysis scripts={result.scripts} />}
                
                {activeTab === 'network' && result.networkCalls && result.networkSummary && (
                  <NetworkAnalysis
                    networkCalls={result.networkCalls}
                    networkSummary={result.networkSummary}
                  />
                )}
                
                {activeTab === 'seo' && result.seoAnalysis && (
                  <SEOAnalysis seoAnalysis={result.seoAnalysis} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ScanHistorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLoadScan={handleLoadScan}
        userId={userId}
      />
    </div>
  );
}