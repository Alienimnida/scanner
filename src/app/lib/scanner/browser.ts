import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

if (process.env.NODE_ENV === 'production') {
  chromium.setGraphicsMode=false;
}

export async function getBrowserInstance() {
  const isLocal = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  if (isLocal) {
    try {
      const puppeteerRegular = await import('puppeteer');
      return puppeteerRegular.default.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ]
      });
    } catch (error) {
      throw new Error('Please install puppeteer for local development: npm install puppeteer');
    }
  } else {
    const executablePath = await chromium.executablePath();
    
    return puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }
}