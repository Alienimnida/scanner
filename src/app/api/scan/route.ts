import { NextRequest, NextResponse } from "next/server";
import { getBrowserInstance } from '@/app/lib/scanner/browser';
import { detectCredentials } from '@/app/lib/scanner/credentials';
import { shouldSkipScript } from '@/app/lib/scanner/filters';
import { isValidUrl, getScriptSize } from '@/app/lib/scanner/utils';
import { setupNetworkMonitoring, analyzeNetworkCalls } from '@/app/lib/scanner/network';
import { calculateSEOScore, generateSEORecommendations } from '@/app/lib/scanner/seo';
import { SEORecommendation, ScanResult, ScannedScript } from '@/app/types/cyberscope';
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

    // Load the main page first
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    console.log('Page loaded, extracting scripts...');

    // Extract scripts
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

    // Process scripts with credentials detection
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

    // Return to the main page after script analysis
    console.log('Returning to main page for SEO analysis...');
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Analyze network calls
    const networkSummary = analyzeNetworkCalls(networkCalls);

    console.log('Starting SEO analysis...');

    // Extract SEO data from the main page
    const seoAnalysis = await page.evaluate(() => {
      console.log('Extracting SEO data from page...');
      
      // Extract basic SEO data
      const title = document.title || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
      const charset = document.querySelector('meta[charset]')?.getAttribute('charset') || 
                      document.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute('content') || '';
      
      // Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '';
      
      // Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '';
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '';
      const twitterDescription = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '';
      const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';
      
      // Structured data
      const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(script => {
          try {
            return JSON.parse(script.textContent || '');
          } catch (e) {
            console.warn('Failed to parse structured data:', e);
            return null;
          }
        })
        .filter(Boolean);
      
      // Headings structure
      const headings = {
        h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim() || '').filter(Boolean),
        h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim() || '').filter(Boolean),
        h3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent?.trim() || '').filter(Boolean),
        h4: Array.from(document.querySelectorAll('h4')).map(h => h.textContent?.trim() || '').filter(Boolean),
        h5: Array.from(document.querySelectorAll('h5')).map(h => h.textContent?.trim() || '').filter(Boolean),
        h6: Array.from(document.querySelectorAll('h6')).map(h => h.textContent?.trim() || '').filter(Boolean)
      };
      
      // Images analysis
      const allImages = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(allImages).filter(img => {
        const alt = img.getAttribute('alt');
        return !alt || alt.trim() === '';
      }).length;
      
      // Links analysis
      const allLinks = document.querySelectorAll('a[href]');
      const internalLinks = Array.from(allLinks).filter(link => {
        const href = link.getAttribute('href');
        return href && (href.startsWith('/') || href.includes(window.location.hostname));
      }).length;
      
      const externalLinks = Array.from(allLinks).filter(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith('http') && !href.includes(window.location.hostname);
      }).length;
      
      // Content analysis
      const textContent = document.body.textContent || '';
      const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
      
      // Performance data (if available)
      let loadTime = 0;
      try {
        if (typeof performance !== 'undefined' && performance.timing) {
          loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        }
      } catch (e) {
        console.warn('Could not get performance timing:', e);
      }
      
      const result = {
        title,
        metaDescription,
        metaKeywords,
        canonical,
        viewport,
        charset,
        openGraph: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage,
          type: ogType
        },
        twitterCard: {
          card: twitterCard,
          title: twitterTitle,
          description: twitterDescription,
          image: twitterImage
        },
        structuredData,
        headings,
        images: {
          total: allImages.length,
          withoutAlt: imagesWithoutAlt
        },
        links: {
          internal: internalLinks,
          external: externalLinks
        },
        content: {
          wordCount,
          textLength: textContent.length
        },
        performance: {
          loadTime
        }
      };
      
      console.log('SEO data extracted:', result);
      return result;
    });

    console.log('SEO analysis completed, checking robots.txt and sitemap...');

    // Check robots.txt and sitemap
    let robotsTxt = '';
    let sitemapExists = false;

    try {
      const robotsUrl = new URL('/robots.txt', url).href;
      console.log(`Checking robots.txt at: ${robotsUrl}`);
      const robotsResponse = await page.goto(robotsUrl, { timeout: 10000 });
      if (robotsResponse?.status() === 200) {
        robotsTxt = await robotsResponse.text();
        console.log('Robots.txt found and loaded');
      }
    } catch (error) {
      console.log('robots.txt not found or failed to load:', error);
    }

    try {
      const sitemapUrl = new URL('/sitemap.xml', url).href;
      console.log(`Checking sitemap at: ${sitemapUrl}`);
      const sitemapResponse = await page.goto(sitemapUrl, { timeout: 10000 });
      sitemapExists = sitemapResponse?.status() === 200;
      if (sitemapExists) {
        console.log('Sitemap.xml found');
      }
    } catch (error) {
      console.log('sitemap.xml not found or failed to load:', error);
    }

    // Combine all SEO data
    const seoData = {
      ...seoAnalysis,
      robotsTxt,
      sitemapExists,
      url: url
    };

    console.log('Computing SEO score and recommendations...');
    
    // Calculate SEO score and generate recommendations
    let seoScore = 0;
    let seoRecommendations: SEORecommendation[] = [];

    try {
      seoScore = calculateSEOScore(seoData);
      seoRecommendations = generateSEORecommendations(seoData);
      console.log(`SEO score calculated: ${seoScore}`);
    } catch (error) {
      console.error('Error calculating SEO score:', error);
      // Provide fallback values
      seoScore = 0;
      seoRecommendations = [{ 
        category: 'System Error', 
        priority: 'low',
        issue: 'SEO analysis failed',
        recommendation: 'Unable to calculate SEO recommendations due to an error'
      }];
    }

    // Build final result
    const result: ScanResult = {
      url,
      scripts: filteredScripts,
      networkCalls,
      timestamp: new Date().toISOString(),
      totalScripts: filteredScripts.length,
      totalCredentials,
      totalNetworkCalls: networkCalls.length,
      credentialsSummary,
      networkSummary,
      seoAnalysis: {
        data: seoData,
        score: seoScore,
        recommendations: seoRecommendations
      }
    };

    console.log(`Scan completed successfully!`);
    console.log(`- Scripts: ${result.totalScripts}`);
    console.log(`- Credentials: ${totalCredentials}`);
    console.log(`- Network calls: ${networkCalls.length}`);
    console.log(`- SEO score: ${seoScore}`);
    console.log(`- SEO recommendations: ${seoRecommendations.length}`);

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
      try {
        await browser.close();
        console.log('Browser closed successfully');
      } catch (error) {
        console.error('Error closing browser:', error);
      }
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