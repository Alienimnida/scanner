import { Key, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { SecurityScore } from '../types/cyberscope';

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getCredentialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'api key':
      return <Key className="w-4 h-4 text-red-400" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-orange-400" />;
  }
};

export const getCredentialColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'api key':
      return 'border-red-600 bg-red-950/50';
    default:
      return 'border-orange-600 bg-orange-950/50';
  }
};

export const getSecurityScore = (
  totalScripts: number, 
  totalCredentials: number, 
  networkSummary?: any
): number => {
  if (totalScripts === 0) return 100;

  const credentialRisk = Math.min((totalCredentials / totalScripts) * 100, 100);

  const networkRisk = networkSummary && (networkSummary.secure + networkSummary.insecure) > 0
    ? (networkSummary.insecure / (networkSummary.secure + networkSummary.insecure)) * 30 
    : 0;
  
  const totalRisk = credentialRisk + networkRisk;
  return Math.max(100 - totalRisk, 0);
};

export const getSecurityLabel = (score: number): SecurityScore => {
  if (score > 80) return { 
    score,
    label: "Highly Secure", 
    color: "text-green-400", 
    icon: <ShieldCheck className="w-6 h-6 text-green-400" /> 
  };
  if (score > 50) return { 
    score,
    label: "Moderately Secure", 
    color: "text-yellow-400", 
    icon: <ShieldCheck className="w-6 h-6 text-yellow-400" /> 
  };
  return { 
    score,
    label: "At Risk", 
    color: "text-red-400", 
    icon: <ShieldAlert className="w-6 h-6 text-red-400" /> 
  };
};

export const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return 'text-green-400';
  if (status >= 400) return 'text-red-400';
  return 'text-yellow-400';
};

export const getMethodColor = (method: string): string => {
  switch (method) {
    case 'GET': return 'bg-blue-600';
    case 'POST': return 'bg-green-600';
    case 'PUT': return 'bg-yellow-600';
    case 'DELETE': return 'bg-red-600';
    default: return 'bg-gray-600';
  }
};