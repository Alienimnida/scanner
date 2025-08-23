export function shouldSkipScript(url: string): boolean {
  const skipPatterns = [
    // CDN patterns
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    'code.jquery.com',
    'ajax.googleapis.com',
    'maxcdn.bootstrapcdn.com',
    'stackpath.bootstrapcdn.com',
    
    // Analytics and tracking
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.net',
    'doubleclick.net',
    
    // Social media widgets
    'platform.twitter.com',
    'connect.facebook.net',
    'apis.google.com',
    
    // Ad networks
    'googlesyndication.com',
    'adsystem.com',
  ];

  return skipPatterns.some(pattern => url.includes(pattern));
}

export function isLikelyFalsePositive(value: string, type: string, content: string, matchIndex: number): boolean {
  const falsePositives = [
    'your_api_key_here',
    'your_secret_here',
    'replace_me',
    'changeme',
    'example',
    'sample',
    'demo',
    'test123',
    'password123',
    'secret123',
    '12345678',
    'xxxxxxxx',
    'placeholder',
    'your_key',
    'your_token',
    'lorem ipsum',
    'undefined',
    'null',
    'true',
    'false',
    '%filtered%'
  ];
  
  if (['Password', 'API Key'].includes(type) && value.length < 8) {
    return true;
  }
  
  if (falsePositives.some(fp => value.toLowerCase().includes(fp.toLowerCase()))) {
    return true;
  }

  if (type === 'High Entropy String (Potential Secret)') {
    if (value.length < 20 || value.length > 200) {
      return true;
    }
    
    if (isJavaScriptIdentifier(value, content, matchIndex)) {
      return true;
    }
    
    if (isFilePathOrUrl(value)) {
      return true;
    }
    
    if (isBuildArtifact(value)) {
      return true;
    }
    
    if (isMinifiedCodeVariable(value)) {
      return true;
    }
    
    if (!hasValidSecretEntropy(value)) {
      return true;
    }
    
    if (isBase64Like(value)) {
      try {
        const decoded = atob(value);
        if (decoded.length < 10 || /^[a-zA-Z\s\-_\.]+$/.test(decoded) || decoded.includes('function') || decoded.includes('var ')) {
          return true;
        }
      } catch (e) {
      }
    }
  }
  
  return false;
}

export function isJavaScriptIdentifier(value: string, content: string, matchIndex: number): boolean {
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
    return false;
  }
  
  const contextBefore = content.substring(Math.max(0, matchIndex - 50), matchIndex);
  const contextAfter = content.substring(matchIndex + value.length, matchIndex + value.length + 50);
  
  const functionPatterns = [
    /function\s*$/,
    /\.\s*$/,
    /var\s+$/,
    /let\s+$/,
    /const\s+$/,
    /=\s*$/,
    /:\s*$/,
    /\[\s*$/,
  ];
  
  const afterFunctionPatterns = [
    /^\s*\(/,
    /^\s*=/,
    /^\s*:/,
    /^\s*\./,
    /^\s*\[/,
    /^\s*\]/,
  ];
  
  return functionPatterns.some(pattern => pattern.test(contextBefore)) ||
         afterFunctionPatterns.some(pattern => pattern.test(contextAfter));
}

export function isFilePathOrUrl(value: string): boolean {
  const pathPatterns = [
    /^[a-zA-Z0-9_\-\.\/\\]+\.(js|css|html|json|xml|txt|md)$/i,
    /^https?:\/\//i,
    /^\/[a-zA-Z0-9_\-\.\/]+$/,
    /^[a-zA-Z]:[a-zA-Z0-9_\-\.\\]+$/,
  ];
  
  return pathPatterns.some(pattern => pattern.test(value));
}

export function isBuildArtifact(value: string): boolean {
  const buildPatterns = [
    /^[a-z]+([A-Z][a-z]*)+$/,
    /chunk/i,
    /webpack/i,
    /bundle/i,
    /module/i,
    /^[0-9a-f]+$/i,
    /polyfill/i,
    /runtime/i,
  ];
  
  return buildPatterns.some(pattern => pattern.test(value));
}

export function isMinifiedCodeVariable(value: string): boolean {
  if (value.length <= 3) {
    return true;
  }
  
  const minifiedPatterns = [
    /^[a-z]{1,3}[0-9]*$/,
    /^_+[a-zA-Z0-9]+$/,
    /^[A-Z]{2,}$/,
  ];
  
  return minifiedPatterns.some(pattern => pattern.test(value));
}

export function hasValidSecretEntropy(value: string): boolean {
  const charset = new Set(value.split(''));
  const diversityRatio = charset.size / value.length;
  
  if (diversityRatio < 0.3) {
    return false;
  }
  
  const hasRepeatedPattern = /(.{2,})\1{2,}/.test(value);
  if (hasRepeatedPattern) {
    return false;
  }
  
  if (value === value.toLowerCase() || value === value.toUpperCase()) {
    if (!/[0-9\-_\+\/=]/.test(value)) {
      return false;
    }
  }
  
  return true;
}

export function isBase64Like(value: string): boolean {
  return /^[A-Za-z0-9+/]+=*$/.test(value) && value.length % 4 === 0;
}
