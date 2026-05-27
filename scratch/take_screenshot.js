const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to a nice desktop size
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Page loaded. Taking screenshot...');
    
    const outputPath = '/Users/kd5000/.gemini/antigravity-ide/brain/185fd690-c80d-437d-8414-e53c1cc6b17e/homepage_preview.png';
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Screenshot saved to ${outputPath}`);
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  } finally {
    await browser.close();
  }
})();
