import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, basename, extname } from 'path';

const inputDir = './client/public/images/features';
const sizes = [400, 600, 800];

async function convertImages() {
  const files = await readdir(inputDir);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  for (const file of pngFiles) {
    const inputPath = join(inputDir, file);
    const name = basename(file, extname(file));

    // Convert to WebP at original size
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(join(inputDir, `${name}.webp`));
    console.log(`Created: ${name}.webp`);

    // Create responsive sizes
    for (const width of sizes) {
      await sharp(inputPath)
        .resize(width)
        .webp({ quality: 80 })
        .toFile(join(inputDir, `${name}-${width}w.webp`));
      console.log(`Created: ${name}-${width}w.webp`);
    }
  }

  console.log('\nDone! All images converted to WebP.');
}

convertImages().catch(console.error);
