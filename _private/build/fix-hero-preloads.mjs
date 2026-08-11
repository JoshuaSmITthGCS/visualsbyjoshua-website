/**
 * Replace full-size hero preloads with responsive AVIF preloads.
 *
 *   node fix-hero-preloads.mjs [--dry]
 *
 * The service pages each carried <link rel="preload" as="image" href="...">
 * pointing at the original hero file, which on charleston-event-photographer
 * was a 3.7 MB WebP. A preload is a high-priority, non-negotiable fetch, so
 * that number lands directly on Largest Contentful Paint on every visit.
 *
 * The replacement uses imagesrcset + imagesizes so the browser preloads the
 * candidate that matches the viewport instead of a single fixed file, and
 * declares type="image/avif" so browsers without AVIF skip it and fall through
 * to the WebP <source> in the hero <picture> rather than double-downloading.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = path.resolve(path.join(import.meta.dirname, '..', '..'));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(SITE, 'images', 'optimized', 'manifest.json'), 'utf8'));
const DRY = process.argv.includes('--dry');

const PAGES = [
  'charleston-photographer/index.html',
  'charleston-portrait-photographer/index.html',
  'charleston-event-photographer/index.html',
  'dmv-photographer/index.html',
  'dmv-portrait-photographer/index.html',
  'dmv-event-photographer/index.html',
];

const mb = (b) => (b / 1048576).toFixed(2);
let totalBefore = 0, totalAfter = 0, changed = 0;

for (const rel of PAGES) {
  const abs = path.join(SITE, rel);
  let src = fs.readFileSync(abs, 'utf8');

  const m = src.match(/[ \t]*<link\s+rel="preload"\s+as="image"\s+href="([^"]+)"[^>]*>\s*\n?/i);
  if (!m) { console.log(`  no image preload  ${rel}`); continue; }

  const href = m[1];
  const entry = MANIFEST[href] || MANIFEST['/' + href.replace(/^\//, '')];
  if (!entry) { console.log(`  NO MANIFEST ENTRY for ${href} in ${rel}`); continue; }

  const beforeBytes = fs.statSync(path.join(SITE, href.replace(/^\//, ''))).size;

  const avifSet = entry.widths.map((w) => `${entry.variants[w].avif} ${w}w`).join(', ');
  // Representative fetch for a typical mobile viewport, used for the reporting
  // number below and as the plain href fallback.
  const repWidth = entry.widths.find((w) => w >= 800) || entry.widths[entry.widths.length - 1];
  const afterBytes = fs.statSync(path.join(SITE, entry.variants[repWidth].avif.replace(/^\//, ''))).size;

  const replacement =
    `  <link rel="preload" as="image" type="image/avif" href="${entry.variants[repWidth].avif}" ` +
    `imagesrcset="${avifSet}" imagesizes="100vw" fetchpriority="high">\n`;

  src = src.replace(m[0], replacement);
  if (!DRY) fs.writeFileSync(abs, src);

  totalBefore += beforeBytes;
  totalAfter += afterBytes;
  changed++;
  console.log(`  ${mb(beforeBytes).padStart(6)} MB -> ${mb(afterBytes).padStart(5)} MB  ${rel}`);
  console.log(`         was ${href}`);
}

console.log('\n' + '-'.repeat(64));
console.log(`${changed} hero preloads rewritten`);
console.log(`preloaded bytes: ${mb(totalBefore)} MB -> ${mb(totalAfter)} MB at the ${'800w'} AVIF candidate`);
if (DRY) console.log('DRY RUN - nothing written');
