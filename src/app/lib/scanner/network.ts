import { Page } from 'puppeteer-core';
import { NetworkCall } from '@/app/types/cyberscope';

export async function setupNetworkMonitoring(page: Page): Promise<NetworkCall[]> {
  const networkCalls: NetworkCall[] = [];
  
  await page.setRequestInterception(true);
  
  page.on('request', (request) => {
    request.continue();
  });
  
  page.on('response', async (response) => {
    try {
      const request = response.request();
      const url = request.url();
      
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        return;
      }
      
      const headers = response.headers();
      const contentType = headers['content-type'] || '';
      const contentLength = headers['content-length'];
      
      let domain = '';
      try {
        domain = new URL(url).hostname;
      } catch (e) {
        domain = 'unknown';
      }
      
      const secure = url.startsWith('https://');
      
      const timing = Date.now();
      
      let size = 0;
      if (contentLength) {
        size = parseInt(contentLength, 10);
      } else {
        try {
          if (response.status() < 400 && contentType.includes('text')) {
            const text = await response.text();
            size = new Blob([text]).size;
          }
        } catch (e) {
          size = 0;
        }
      }
      
      const networkCall: NetworkCall = {
        url,
        method: request.method(),
        status: response.status(),
        size,
        type: getResourceType(contentType, url),
        secure,
        domain,
        timing
      };
      
      networkCalls.push(networkCall);
      
    } catch (error) {
      console.error('Error processing network response:', error);
    }
  });
  
  return networkCalls;
}

function getResourceType(contentType: string, url: string): string {
  const lowerContentType = contentType.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  if (lowerContentType.includes('javascript') || lowerContentType.includes('application/json')) {
    return 'script';
  }
  if (lowerContentType.includes('text/css')) {
    return 'stylesheet';
  }
  if (lowerContentType.includes('image/')) {
    return 'image';
  }
  if (lowerContentType.includes('font/') || lowerContentType.includes('application/font')) {
    return 'font';
  }
  if (lowerContentType.includes('text/html')) {
    return 'document';
  }
  if (lowerContentType.includes('video/')) {
    return 'media';
  }
  if (lowerContentType.includes('audio/')) {
    return 'media';
  }
  
  if (lowerUrl.includes('.js')) return 'script';
  if (lowerUrl.includes('.css')) return 'stylesheet';
  if (lowerUrl.includes('.png') || lowerUrl.includes('.jpg') || lowerUrl.includes('.gif') || lowerUrl.includes('.svg') || lowerUrl.includes('.webp')) return 'image';
  if (lowerUrl.includes('.woff') || lowerUrl.includes('.ttf') || lowerUrl.includes('.eot')) return 'font';
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.mp3')) return 'media';
  
  return 'other';
}

export function analyzeNetworkCalls(networkCalls: NetworkCall[]) {
  const secure = networkCalls.filter(call => call.secure).length;
  const insecure = networkCalls.filter(call => !call.secure).length;
  const totalSize = networkCalls.reduce((sum, call) => sum + call.size, 0);
  const domains = [...new Set(networkCalls.map(call => call.domain))];
  
  return {
    secure,
    insecure,
    totalSize,
    domains,
    totalCalls: networkCalls.length
  };
}