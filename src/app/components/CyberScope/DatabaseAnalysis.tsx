import React from 'react';
import { DatabaseScanResult, DatabaseExposure } from '@/app/types/cyberscope';
import { AlertTriangle, Database, FileText, Link, Server, AlertCircle, Eye, FolderOpen } from 'lucide-react';

interface DatabaseAnalysisProps {
  databaseSecurity: DatabaseScanResult;
}

const severityColors = {
  critical: 'text-red-400 bg-red-900/20 border-red-800',
  high: 'text-orange-400 bg-orange-900/20 border-orange-800',
  medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-800',
  low: 'text-blue-400 bg-blue-900/20 border-blue-800'
};

const exposureTypeIcons = {
  config_file: FileText,
  connection_string: Link,
  sql_dump: Database,
  backup_file: Database,
  admin_interface: Server,
  error_message: AlertCircle,
  directory_listing: FolderOpen
};

const exposureTypeLabels = {
  config_file: 'Configuration File',
  connection_string: 'Connection String',
  sql_dump: 'SQL Dump',
  backup_file: 'Backup File',
  admin_interface: 'Admin Interface',
  error_message: 'Error Message',
  directory_listing: 'Directory Listing'
};

export function DatabaseAnalysis({ databaseSecurity }: DatabaseAnalysisProps) {
  const { totalExposures, criticalExposures, highExposures, mediumExposures, lowExposures, exposures, summary } = databaseSecurity;

  if (totalExposures === 0) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-green-400 mb-4" />
        <h3 className="text-lg font-medium text-green-400 mb-2">No Database Exposures Found</h3>
        <p className="text-gray-400">
          Great! No database-related security exposures were detected on this website.
        </p>
      </div>
    );
  }

  // Group exposures by severity
  const groupedBySeverity = exposures.reduce((acc, exposure) => {
    if (!acc[exposure.severity]) {
      acc[exposure.severity] = [];
    }
    acc[exposure.severity].push(exposure);
    return acc;
  }, {} as Record<string, DatabaseExposure[]>);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <AlertCircle className="h-5 w-5" />;
      case 'low': return <Eye className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Total Exposures</p>
              <p className="text-2xl font-bold text-white">{totalExposures}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Critical</p>
              <p className="text-2xl font-bold text-red-400">{criticalExposures}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">High Risk</p>
              <p className="text-2xl font-bold text-orange-400">{highExposures}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Types Found</p>
              <p className="text-2xl font-bold text-white">{Object.keys(summary).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exposure Type Summary */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Exposure Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(summary).map(([type, count]) => {
            const Icon = exposureTypeIcons[type as keyof typeof exposureTypeIcons] || Database;
            const label = exposureTypeLabels[type as keyof typeof exposureTypeLabels] || type;
            
            return (
              <div key={type} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <Icon className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-300">{label}</p>
                  <p className="text-lg font-semibold text-white">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Exposures by Severity */}
      <div className="space-y-6">
        {['critical', 'high', 'medium', 'low'].map(severity => {
          const severityExposures = groupedBySeverity[severity];
          if (!severityExposures || severityExposures.length === 0) return null;

          return (
            <div key={severity} className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {getSeverityIcon(severity)}
                <h3 className="text-lg font-semibold text-white ml-2 capitalize">
                  {severity} Risk Exposures ({severityExposures.length})
                </h3>
              </div>
              
              <div className="space-y-4">
                {severityExposures.map((exposure, index) => {
                  const Icon = exposureTypeIcons[exposure.type] || Database;
                  
                  return (
                    <div
                      key={`${exposure.type}-${index}`}
                      className={`border rounded-lg p-4 ${severityColors[exposure.severity]}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {exposureTypeLabels[exposure.type] || exposure.type}
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[exposure.severity]}`}>
                              {exposure.severity.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-300 mt-1">
                            {exposure.description}
                          </p>
                          
                          {exposure.url && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-400">URL:</p>
                              <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                                {exposure.url}
                              </code>
                            </div>
                          )}
                          
                          {exposure.evidence && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-400">Evidence:</p>
                              <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                                {exposure.evidence}
                              </pre>
                            </div>
                          )}
                          
                          <div className="mt-3 p-3 bg-blue-900/20 rounded border border-blue-800">
                            <p className="text-xs text-blue-300 font-medium">Recommendation:</p>
                            <p className="text-sm text-blue-200 mt-1">
                              {exposure.recommendation}
                            </p>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            Source: {exposure.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}