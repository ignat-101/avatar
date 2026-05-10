import fs from 'fs';
import https from 'https';
import path from 'path';

const files = [
  { url: 'https://raw.githubusercontent.com/ignat-101/avatar/main/src/App.tsx', path: 'src/App.tsx' },
  { url: 'https://raw.githubusercontent.com/ignat-101/avatar/main/src/components/Icons.tsx', path: 'src/components/Icons.tsx' },
  { url: 'https://raw.githubusercontent.com/ignat-101/avatar/main/src/constants.ts', path: 'src/constants.ts' },
  { url: 'https://raw.githubusercontent.com/ignat-101/avatar/main/src/index.css', path: 'src/index.css' },
  { url: 'https://raw.githubusercontent.com/ignat-101/avatar/main/src/utils/cn.ts', path: 'src/utils/cn.ts' },
  { url: 'https://raw.githubusercontent.com/ignat-101/avatar/main/src/main.tsx', path: 'src/main.tsx' }
];

files.forEach(({ url, path: filePath }) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      fs.writeFileSync(filePath, data);
      console.log(`Saved ${filePath}`);
    });
  }).on('error', (err) => {
    console.error(`Error fetching ${url}:`, err.message);
  });
});
