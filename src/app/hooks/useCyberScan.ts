import { useState } from 'react';
import type { ScanResult } from '../types/cyberscope';

interface VerificationError {
  requiresVerification: boolean;
  domain?: string;
}

interface VerificationInstructions {
  token: string;
  instructions: {
    dns: string;
    html: string;
    file: string;
  };
}

interface UseCyberScanProps {
  userId?: string;
}

export const useCyberScan = ({ userId }: UseCyberScanProps = {}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationInstructions, setVerificationInstructions] = useState<VerificationInstructions | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [domainToVerify, setDomainToVerify] = useState<string | null>(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setVerificationRequired(false);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 403 && errorData.requiresVerification) {
          setVerificationRequired(true);
          setDomainToVerify(errorData.domain);
          setError(errorData.error);
          return;
        }

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before scanning again.');
        }

        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const scanResult: ScanResult = await response.json();
      setResult(scanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while scanning');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateVerificationToken = async (domain?: string) => {
    const targetDomain = domain || domainToVerify;
    
    if (!targetDomain) {
      setError('No domain to verify');
      return;
    }

    setVerificationLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verify/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: targetDomain,
          userId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate verification token');
      }

      const instructions: VerificationInstructions = await response.json();
      setVerificationInstructions(instructions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate verification token');
      console.error('Token generation error:', err);
    } finally {
      setVerificationLoading(false);
    }
  };

  const checkVerification = async (targetUrl?: string) => {
    const urlToCheck = targetUrl || url.trim();
    
    if (!urlToCheck) {
      setError('No URL to verify');
      return false;
    }

    setVerificationLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verify/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: urlToCheck,
          userId 
        }),
      });

      const verificationResult = await response.json();

      if (verificationResult.verified) {
        setVerificationRequired(false);
        setVerificationInstructions(null);
        setDomainToVerify(null);
        setTimeout(() => handleScan(), 1000);
        return true;
      } else {
        setError(verificationResult.error || 'Domain verification failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification check failed');
      console.error('Verification check error:', err);
      return false;
    } finally {
      setVerificationLoading(false);
    }
  };

  const resetVerification = () => {
    setVerificationRequired(false);
    setVerificationInstructions(null);
    setDomainToVerify(null);
    setError(null);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    resetVerification();
  };

  return {
    url,
    setUrl,
    loading,
    result,
    error,
    handleScan,
    reset,
    verificationRequired,
    verificationInstructions,
    verificationLoading,
    domainToVerify,
    generateVerificationToken,
    checkVerification,
    resetVerification,
    userId
  };
}