import https from 'https';
import fs from 'fs';

https.get('https://www.instagram.com/p/DcdzsL4IYbC/embed/captioned/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    fs.writeFileSync('scripts/sample-embed.html', html);
    const matches = html.match(/https:\/\/[^"'\s\\]+scontent[^"'\s\\]+/gi) || [];
    console.log('Matches found:', matches.length);
    matches.forEach(m => console.log('Match:', m.substring(0, 100)));
  });
});
