import https from 'https';
import fs from 'fs';

const shortcodes = [
  'DcdzsL4IYbC',
  'DcLchhOIVMg',
  'Db-Z528xVBR',
  'DbnAvUVIndT',
  'DblTtmSIiMA',
  'DbDxzcgowkW',
  'DbFXrjhomhx',
  'DabGFUexMct',
  'DaaDKwFxv0u',
  'DZcZznjojzc',
  'DZA07-ERxaW',
  'DXwshvOo5sB'
];

async function fetchThumbnail(code) {
  return new Promise((resolve) => {
    https.get(`https://www.instagram.com/p/${code}/embed/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        // Look for image src in embed
        const match = html.match(/class=["']EmbeddedMediaImage["'][^>]*src=["']([^"']+)["']/i)
          || html.match(/<img[^>]+src=["'](https:\/\/[^"']+(?:cdninstagram|fbcdn)[^"']+)["']/i);
        if (match && match[1]) {
          const imgUrl = match[1].replace(/&amp;/g, '&');
          resolve({ code, imgUrl });
        } else {
          // Look for any cdn url
          const cdnMatch = html.match(/https:\/\/[^"'\s\\]+(?:cdninstagram|fbcdn\.net)[^"'\s\\]+/i);
          resolve({ code, imgUrl: cdnMatch ? cdnMatch[0].replace(/&amp;/g, '&') : null });
        }
      });
    }).on('error', () => resolve({ code, imgUrl: null }));
  });
}

async function run() {
  for (const code of shortcodes) {
    const result = await fetchThumbnail(code);
    console.log(`${code}: ${result.imgUrl ? 'FOUND' : 'NOT FOUND'} -> ${result.imgUrl?.substring(0, 80)}...`);
  }
}
run();
