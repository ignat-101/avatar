import https from 'https';
import fs from 'fs';

https.get('https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=035', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('ton.svg', data);
    console.log('Saved ton.svg');
  });
});
