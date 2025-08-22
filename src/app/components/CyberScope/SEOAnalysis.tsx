import { useState } from "react";
import { SEODetails } from "./SEODetails";
import { SEORecommendations } from "./SEORecommendations";
import { SEOScore } from "./SEOScore";
import type { SEOAnalysis } from "../../types/cyberscope";

export function SEOAnalysis({ seoAnalysis }: { seoAnalysis: SEOAnalysis }) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'recommendations' | 'details'>('overview');

  const subTabs = [
    { key: 'overview' as const, label: 'Overview', count: null },
    { key: 'recommendations' as const, label: 'Recommendations', count: seoAnalysis.recommendations.length },
    { key: 'details' as const, label: 'Technical Details', count: null }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeSubTab === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeSubTab === tab.key ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-700 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeSubTab === 'overview' && (
          <SEOScore score={seoAnalysis.score} />
        )}
        
        {activeSubTab === 'recommendations' && (
          <SEORecommendations recommendations={seoAnalysis.recommendations} />
        )}
        
        {activeSubTab === 'details' && (
          <SEODetails seoData={seoAnalysis.data} />
        )}
      </div>
    </div>
  );
}