const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/icon.svg');
const pngPath = path.join(__dirname, '../assets/icon.png');

async function convert() {
  try {
    console.log('Converting SVG to PNG...');
    await sharp(svgPath)
      .resize(1024, 1024)
      .png()
      .toFile(pngPath);
    console.log('Successfully created assets/icon.png');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convert();
