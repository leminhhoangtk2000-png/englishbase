#!/usr/bin/env node

/**
 * Favicon Generator Script
 * 
 * Generates multiple favicon sizes from source image (avt.png)
 * Requires: sharp package (npm install --save-dev sharp)
 * 
 * Usage: npm run generate-favicons
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
const inputFile = path.join(__dirname, '../public/avt.png');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  console.log('🎨 Generating favicons from avt.png...\n');

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error('❌ Error: avt.png not found in public/');
    console.error('   Please make sure avt.png exists in the public folder');
    process.exit(1);
  }

  try {
    // Generate favicon.ico (32x32)
    console.log('📦 Creating favicon.ico...');
    await sharp(inputFile)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(path.join(outputDir, 'favicon.ico'));
    console.log('   ✅ favicon.ico (32x32)');

    // Generate PNG favicons
    console.log('\n📦 Creating PNG favicons...');
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `favicon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(outputFile);
      console.log(`   ✅ favicon-${size}x${size}.png`);
    }

    // Generate apple-touch-icon (180x180)
    console.log('\n📱 Creating Apple touch icon...');
    await sharp(inputFile)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('   ✅ apple-touch-icon.png (180x180)');

    // Generate Android Chrome icons
    console.log('\n🤖 Creating Android Chrome icons...');
    await sharp(inputFile)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-192x192.png'));
    console.log('   ✅ android-chrome-192x192.png');

    await sharp(inputFile)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-512x512.png'));
    console.log('   ✅ android-chrome-512x512.png');

    console.log('\n🎉 All favicons generated successfully!');
    console.log('\n📋 Summary:');
    console.log('   • favicon.ico (for browsers)');
    console.log('   • 9 PNG sizes (16px to 512px)');
    console.log('   • Apple touch icon (iOS)');
    console.log('   • Android Chrome icons');
    console.log('\n✨ You can now use these favicons in your website!');
    
  } catch (error) {
    console.error('\n❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateFavicons();
