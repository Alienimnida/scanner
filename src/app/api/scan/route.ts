import { NextRequest, NextResponse } from "next/server";
import { getBrowserInstance } from '@/app/lib/scanner/browser';
import { detectCredentials } from '@/app/lib/scanner/credentials';
import { shouldSkipScript } from '@/app/lib/scanner/filters';
import { isValidUrl, getScriptSize } from '@/app/lib/scanner/utils';
import { setupNetworkMonitoring, analyzeNetworkCalls } from '@/app/lib/scanner/network';
import { ScanResult, ScannedScript } from '@/app/types/cyberscope';
import { DomainVerifier } from '@/app/lib/verification/domain-verification';


export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const body = await request.json();
    const { url, userId } = body;

    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    if (!DomainVerifier.checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (DomainVerifier.isSuspiciousDomain(url)) {
      return NextResponse.json(
        { 
          error: 'This domain cannot be scanned for security reasons.',
          requiresVerification: true 
        },
        { status: 403 }
      );
    }

    const isVerified = await DomainVerifier.isDomainVerified(url, userId);
    const isWhitelisted = await DomainVerifier.isWhitelistedDomain(url);

    if (!isVerified && !isWhitelisted) {
      return NextResponse.json(
        { 
          error: 'Domain verification required. Please verify domain ownership first.',
          requiresVerification: true,
          domain: DomainVerifier.extractDomain(url)
        },
        { status: 403 }
      );
    }

    console.log(`Starting scan for: ${url} (verified: ${isVerified}, whitelisted: ${isWhitelisted})`);

    browser = await getBrowserInstance();
    const page = await browser.newPage();

    const networkCalls = await setupNetworkMonitoring(page);

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    console.log('Page loaded, extracting scripts...');

    const scripts = await page.evaluate(() => {
      const scriptElements = document.querySelectorAll('script');
      const extractedScripts: ScannedScript[] = [];

      scriptElements.forEach((script) => {
        if (script.src) {
          extractedScripts.push({
            url: script.src,
            type: 'external'
          });
        } else if (script.textContent && script.textContent.trim()) {
          extractedScripts.push({
            url: window.location.href + '#inline-' + extractedScripts.length,
            type: 'inline',
            content: script.textContent
          });
        }
      });

      return extractedScripts;
    });

    console.log(`Found ${scripts.length} scripts, filtering...`);

    const filteredScripts: ScannedScript[] = [];
    let totalCredentials = 0;
    const credentialsSummary: { [key: string]: number } = {};
    
    for (const script of scripts) {
      if (script.type === 'external' && shouldSkipScript(script.url)) {
        console.log(`Skipping CDN script: ${script.url}`);
        continue;
      }

      if (script.type === 'inline' && script.content) {
        const size = getScriptSize(script.content);
        script.size = size;
        
        if (size > 2 * 1024 * 1024) {
          console.log(`Skipping large inline script: ${size} bytes`);
          continue;
        }
        
        script.credentials = detectCredentials(script.content, script.url);
        totalCredentials += script.credentials.length;
        
        script.credentials.forEach(cred => {
          credentialsSummary[cred.type] = (credentialsSummary[cred.type] || 0) + 1;
        });
      }

      if (script.type === 'external') {
        try {
          const response = await page.goto(script.url, { timeout: 10000 });
          const content = await response?.text();
          
          if (content) {
            const size = getScriptSize(content);
            script.size = size;
            
            if (size > 2 * 1024 * 1024) {
              console.log(`Skipping large external script: ${script.url} (${size} bytes)`);
              continue;
            }
            
            script.content = content;
            script.credentials = detectCredentials(content, script.url);
            totalCredentials += script.credentials.length;

            script.credentials.forEach(cred => {
              credentialsSummary[cred.type] = (credentialsSummary[cred.type] || 0) + 1;
            });
          }
        } catch (error) {
          console.log(`Failed to fetch external script: ${script.url}`);
          script.credentials = [];
        }
      }

      filteredScripts.push(script);
    }

    const networkSummary = analyzeNetworkCalls(networkCalls);

    const result: ScanResult = {
      url,
      scripts: filteredScripts,
      networkCalls,
      timestamp: new Date().toISOString(),
      totalScripts: filteredScripts.length,
      totalCredentials,
      totalNetworkCalls: networkCalls.length,
      credentialsSummary,
      networkSummary
    };

    console.log(`Scan completed. Found ${result.totalScripts} scripts, ${totalCredentials} potential credentials, and ${networkCalls.length} network calls after filtering.`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error during scan:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scan the website',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}