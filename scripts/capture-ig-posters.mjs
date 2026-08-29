import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const reelsData = [
  { id: 'reel-ig-1', code: 'DcdzsL4IYbC', file: 'reel-1.jpg' },
  { id: 'reel-ig-2', code: 'DcLchhOIVMg', file: 'reel-2.jpg' },
  { id: 'reel-ig-3', code: 'Db-Z528xVBR', file: 'reel-3.jpg' },
  { id: 'reel-ig-4', code: 'DbnAvUVIndT', file: 'reel-4.jpg' },
  { id: 'reel-ig-5', code: 'DblTtmSIiMA', file: 'reel-5.jpg' },
  { id: 'reel-ig-6', code: 'DbDxzcgowkW', file: 'reel-6.jpg' },
  { id: 'reel-ig-7', code: 'DbFXrjhomhx', file: 'reel-7.jpg' },
  { id: 'reel-ig-8', code: 'DabGFUexMct', file: 'reel-8.jpg' },
  { id: 'reel-ig-9', code: 'DaaDKwFxv0u', file: 'reel-9.jpg' },
  { id: 'reel-ig-10', code: 'DZcZznjojzc', file: 'reel-10.jpg' },
  { id: 'reel-ig-11', code: 'DZA07-ERxaW', file: 'reel-11.jpg' },
  { id: 'reel-ig-12', code: 'DXwshvOo5sB', file: 'reel-12.jpg' },
];

const outDir = path.resolve('public/reels');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureAll() {
  console.log('Launching browser with Edge binary at:', edgePath);
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 2 });

  for (const item of reelsData) {
    const url = `https://www.instagram.com/reel/${item.code}/embed/`;
    console.log(`Loading reel ${item.code}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for any media container
      await page.waitForSelector('.EmbeddedMedia, .EmbeddedMediaImage, video, img', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2500)); // Wait for render

      // Look for the inner media element
      const mediaElement = await page.$('.EmbeddedMedia, .EmbeddedMediaImage, .Embed') || page;
      const targetPath = path.join(outDir, item.file);

      // Clip the central video/media area to get pure video thumbnail
      await mediaElement.screenshot({
        path: targetPath,
        type: 'jpeg',
        quality: 90
      });
      console.log(`Saved screenshot to ${item.file}`);
    } catch (err) {
      console.error(`Error capturing ${item.code}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished capturing all reel covers!');
}

captureAll();
