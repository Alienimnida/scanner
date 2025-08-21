'use client';

import { useState } from 'react';
import { useCyberScan } from '../../hooks/useCyberScan';
import { Header } from './Header';
import { ScanInput } from './ScanInput';
import { SecurityScore } from './SecurityScore';
import { StatsCards } from './StatsCards';
import { CriticalAlerts } from './CriticalAlerts';
import { ScriptAnalysis } from './ScriptAnalysis';
import { NetworkAnalysis } from './NetworkAnalysis';
import { TabNavigation } from '../ui/TabNavigation';
import { ErrorAlert } from '../ui/ErrorAlert';
import { DomainVerification } from './DomainVerification';
import type { TabType } from '../../types/cyberscope';

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
    resetVerification
  } = useCyberScan();
  
  const [activeTab, setActiveTab] = useState<TabType>('scripts');

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
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}