import { credentialPatterns } from './patterns';
import { isLikelyFalsePositive } from './filters';
import { CredentialMatch } from '@/app/types/cyberscope';

export function detectCredentials(content: string, scriptUrl: string): CredentialMatch[] {
  const credentials: CredentialMatch[] = [];
  const lines = content.split('\n');
  
  credentialPatterns.forEach(({ pattern, type }) => {
    let match;
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      const matchValue = match[1] || match[0];
      
      if (isLikelyFalsePositive(matchValue, type, content, match.index)) {
        continue;
      }
      
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      
      const context = lines[lineNumber - 1] || '';
      
      credentials.push({
        type,
        value: matchValue,
        line: lineNumber,
        context: context.trim().substring(0, 100) + (context.length > 100 ? '...' : '')
      });
    }
  });
  
  return credentials;
}