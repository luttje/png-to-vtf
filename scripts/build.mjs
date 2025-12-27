import * as esbuild from 'esbuild';
import { copyFileSync, rmSync, mkdirSync, existsSync, readdirSync, unlinkSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const docsDir = resolve(rootDir, 'docs');

// Clean dist folder
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true });
}
mkdirSync(distDir);

console.log('🔨 Building png-to-vtf distributions...\n');

// Shared options
const sharedOptions = {
  entryPoints: [resolve(rootDir, 'index.js')],
  bundle: true,
  sourcemap: false,
};

// Browser builds - stub out Node.js modules
const browserOptions = {
  ...sharedOptions,
  platform: 'browser',
  // Replace Node.js modules with empty stubs for browser
  alias: {
    'fs': resolve(rootDir, 'scripts/stubs/fs.js'),
    'path': resolve(rootDir, 'scripts/stubs/path.js'),
    'sharp': resolve(rootDir, 'scripts/stubs/sharp.js'),
  },
  // Define to help with dead code elimination
  define: {
    'process.versions.node': 'undefined',
  },
};

const builds = [
  // Browser ESM
  {
    ...browserOptions,
    outfile: resolve(distDir, 'png-to-vtf.browser.mjs'),
    format: 'esm',
    minify: false,
  },
  // Browser ESM (minified)
  {
    ...browserOptions,
    outfile: resolve(distDir, 'png-to-vtf.browser.min.mjs'),
    format: 'esm',
    minify: true,
  },
  // Browser IIFE (for script tags)
  {
    ...browserOptions,
    outfile: resolve(distDir, 'png-to-vtf.browser.js'),
    format: 'iife',
    globalName: 'PNGToVTF',
    minify: false,
  },
  // Browser IIFE (minified)
  {
    ...browserOptions,
    outfile: resolve(distDir, 'png-to-vtf.browser.min.js'),
    format: 'iife',
    globalName: 'PNGToVTF',
    minify: true,
  },
];

// Run all builds
for (const config of builds) {
  const filename = config.outfile.split(/[/\\]/).pop();
  console.log(`  📦 Building ${filename}...`);
  await esbuild.build(config);
}

// Copy browser files to docs/
console.log('\n📋 Copying browser builds to docs/...');

if (!existsSync(docsDir)) {
  mkdirSync(docsDir);
}

// Remove old browser files from docs
const existingFiles = readdirSync(docsDir);
for (const file of existingFiles) {
  if (file.startsWith('png-to-vtf.') && (file.endsWith('.js') || file.endsWith('.mjs'))) {
    unlinkSync(resolve(docsDir, file));
  }
}

const filesToCopy = [
  'png-to-vtf.browser.js',
  'png-to-vtf.browser.min.js',
  'png-to-vtf.browser.mjs',
  'png-to-vtf.browser.min.mjs',
];

for (const file of filesToCopy) {
  const src = resolve(distDir, file);
  const dest = resolve(docsDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`  ✓ ${file}`);
  }
}

console.log('\n✅ Build complete!\n');

// Show file sizes
console.log('dist/ contents:');
for (const file of readdirSync(distDir)) {
  const path = resolve(distDir, file);
  const stat = statSync(path);
  const sizeKB = (stat.size / 1024).toFixed(1);
  console.log(`  ${file.padEnd(32)} ${sizeKB} KB`);
}
