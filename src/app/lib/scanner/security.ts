import { ScanResult, SecurityScore } from '@/app/types/cyberscope';

export function calculateSecurityScore(scanResult: ScanResult): SecurityScore {
  let score = 100;
  let issues: string[] = [];
  
  if (scanResult.totalCredentials > 0) {
    score -= Math.min(50, scanResult.totalCredentials * 10);
    issues.push(`${scanResult.totalCredentials} potential credentials found`);
  }
  
  if (scanResult.networkSummary) {
    if (scanResult.networkSummary.insecure > 0) {
      score -= Math.min(20, scanResult.networkSummary.insecure * 2);
      issues.push(`${scanResult.networkSummary.insecure} insecure network calls`);
    }
    
    if (scanResult.networkSummary.domains.length > 10) {
      score -= Math.min(10, (scanResult.networkSummary.domains.length - 10) * 1);
      issues.push(`${scanResult.networkSummary.domains.length} external domains`);
    }
  }
  
  score = Math.max(0, score);
  
  let label: string;
  let color: string;
  
  if (score >= 90) {
    label = 'Excellent';
    color = 'green';
  } else if (score >= 75) {
    label = 'Good';
    color = 'blue';
  } else if (score >= 50) {
    label = 'Fair';
    color = 'yellow';
  } else if (score >= 25) {
    label = 'Poor';
    color = 'orange';
  } else {
    label = 'Critical';
    color = 'red';
  }
  
  return {
    score,
    label,
    color,
    icon: null
  };
}
