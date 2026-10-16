const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
  'WhatsApp Image 2026-10-12 at 12.42.14 PM.jpeg': 'hero-twilight.jpg',
  'WhatsApp Image 2026-10-12 at 12.42.56 PM.jpeg': 'estate-day.jpg',
  'WhatsApp Image 2026-10-12 at 12.43.13 PM (1).jpeg': 'suite-bath.jpg',
  'WhatsApp Image 2026-10-12 at 12.54.52 PM (1).jpeg': 'sunset-loungers.jpg',
  'WhatsApp Image 2026-10-12 at 12.56.15 PM.jpeg': 'infinity-dusk.jpg',
  'WhatsApp Image 2026-10-12 at 12.56.25 PM.jpeg': 'suite-bedroom.jpg',
  'WhatsApp Image 2026-10-12 at 12.56.34 PM.jpeg': 'games-lounge.jpg',
  'WhatsApp Image 2026-10-12 at 12.57.13 PM.jpeg': 'aerial-estate.jpg'
};

for (const [orig, target] of Object.entries(fileMap)) {
  const origPath = path.join(srcDir, orig);
  const targetPath = path.join(destDir, target);
  if (fs.existsSync(origPath)) {
    fs.copyFileSync(origPath, targetPath);
    console.log(`Copied ${orig} -> ${target}`);
  } else {
    console.warn(`File not found: ${origPath}`);
  }
}

// Also make a symlink or ensure shot1 and shot2 are accessible inside public or root
const publicShot1 = path.join(__dirname, 'public', 'shot1');
const publicShot2 = path.join(__dirname, 'public', 'shot2');

// If public/shot1 doesn't exist, we can create junction or copy or serve from root
try {
  if (!fs.existsSync(publicShot1)) {
    fs.symlinkSync(path.join(__dirname, 'shot1'), publicShot1, 'junction');
    console.log('Linked shot1 to public/shot1');
  }
  if (!fs.existsSync(publicShot2)) {
    fs.symlinkSync(path.join(__dirname, 'shot2'), publicShot2, 'junction');
    console.log('Linked shot2 to public/shot2');
  }
} catch (err) {
  console.log('Symlink error, will handle via fallback path:', err.message);
}
console.log('Asset setup completed.');
