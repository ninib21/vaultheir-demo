const QRCode = require('qrcode');
const fs = require('fs');

// Change this to your actual URL
const APP_URL = process.argv[2] || 'http://YOUR_VPS_IP:3000';

// Generate QR code as PNG
QRCode.toFile('investor-qr-code.png', APP_URL, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, (err) => {
  if (err) throw err;
  console.log('QR Code generated: investor-qr-code.png');
  console.log('URL encoded:', APP_URL);
});

// Also generate as terminal output
QRCode.toString(APP_URL, { type: 'terminal', small: true }, (err, string) => {
  if (err) throw err;
  console.log('\nScan this QR code:\n');
  console.log(string);
});
