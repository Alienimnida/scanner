import { FileText, Server } from 'lucide-react';
import type { TabType } from '../../types/cyberscope';

interface Tab {
  key: TabType;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileText':
      return <FileText className="w-5 h-5" />;
    case 'Server':
      return <Server className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

export const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 px-6 py-4 font-medium transition-colors ${
            activeTab === tab.key
              ? 'bg-cyan-600 text-white border-b-2 border-cyan-400'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {getIcon(tab.icon)}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
};