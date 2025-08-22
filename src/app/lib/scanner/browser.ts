import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

if (process.env.NODE_ENV === 'production') {
  chromium.setGraphicsMode = false;
}

export async function getBrowserInstance() {
  const isLocal = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;
     
  if (isLocal) {
    return puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || 
        (process.platform === 'win32' 
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'darwin' 
            ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : '/usr/bin/google-chrome-stable'
        ),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    });
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
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: true,
    });
  }
}