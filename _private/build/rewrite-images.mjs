/**
 * Repoint <img> tags at the derivatives built by optimize-images.mjs.
 *
 *   node rewrite-images.mjs --target blog          blog.html cards
 *   node rewrite-images.mjs --target service       the 6 service pages
 *   node rewrite-images.mjs --target posts         all 55 blog posts
 *   node rewrite-images.mjs --target all
 *   ... add --dry to preview without writing
 *
 * Each matching <img> becomes a <picture> offering AVIF, then WebP, then the
 * original-format JPEG fallback, each with a width-descriptor srcset and a
 * sizes attribute derived from the actual CSS layout of that template.
 *
 * Attributes on the original tag are preserved (alt, class, id, loading,
 * decoding, fetchpriority, style, data-*). Only src, srcset, sizes, width and
 * height are rewritten; width/height come from the manifest so the declared
 * ratio always matches the real pixels.
 *
 * Idempotent: an <img> already inside a <picture> is skipped.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = path.resolve(path.join(import.meta.dirname, '..', '..'));
const MANIFEST = path.join(SITE, 'images', 'optimized', 'manifest.json');
const DRY = process.argv.includes('--dry');
const targetArg = (() => {
  const i = process.argv.indexOf('--target');
  return i === -1 ? 'all' : (process.argv[i + 1] || 'all');
})();

if (!fs.existsSync(MANIFEST)) {
  console.error('No manifest. Run optimize-images.mjs first.');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

/**
 * Images we deliberately leave alone. The logo is 58 KB, is rendered at 40 px
 * tall, and sits inside a display:flex anchor where introducing a <picture>
 * element would add a flex item and risk shifting the nav.
 */
const SKIP_BASENAMES = new Set(['Logo.webp']);

/* -------------------------------------------------------------- size recipes */

/**
 * .blog-grid is repeat(auto-fill, minmax(350px, 1fr)) inside a 1200px container
 * with 30px gaps and 20px side padding, so cards settle at roughly 366px on
 * desktop, half the viewport on tablets, and full width less padding on phones.
 */
const SIZES_CARD =
  '(min-width: 1240px) 366px, (min-width: 810px) calc((100vw - 100px) / 3), (min-width: 430px) calc((100vw - 70px) / 2), calc(100vw - 40px)';

/** Service and post heroes run the full content column, capped near 1200px. */
const SIZES_HERO = '(min-width: 1200px) 1200px, 100vw';

/** In-article images sit in a ~760px prose column. */
const SIZES_PROSE = '(min-width: 800px) 760px, calc(100vw - 40px)';

const TARGETS = {
  blog:    { files: ['blog.html'],                       sizes: () => SIZES_CARD },
  service: { files: [
      'charleston-photographer/index.html',
      'charleston-portrait-photographer/index.html',
      'charleston-event-photographer/index.html',
      'dmv-photographer/index.html',
      'dmv-portrait-photographer/index.html',
      'dmv-event-photographer/index.html',
    ], sizes: (ctx) => (ctx.isHero ? SIZES_HERO : SIZES_PROSE) },
  posts:   { files: null, sizes: (ctx) => (ctx.isHero ? SIZES_HERO : SIZES_PROSE) },
};

function postFiles() {
  const dir = path.join(SITE, 'blog');
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const f = path.join(dir, e.name, 'index.html');
    if (fs.existsSync(f)) out.push(path.relative(SITE, f));
  }
  return out.sort();
}

/* ------------------------------------------------------------------ rewriting */

function parseAttrs(tag) {
  const attrs = {};

  // Quoted attributes first, recording the exact spans they occupy so the
  // bare-attribute scan below cannot see inside a value. Without this, words in
  // an alt string ("Charleston spring portrait session under oak trees") each
  // get picked up as valueless attributes and re-emitted as markup.
  let stripped = tag;
  for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
    attrs[m[1].toLowerCase()] = m[3] !== undefined ? m[3] : m[4];
    stripped = stripped.replace(m[0], ' '.repeat(m[0].length));
  }

  // Now any remaining word in the blanked-out tag is a genuine bare attribute.
  for (const m of stripped.matchAll(/(?:^|\s)([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?=\s|\/?>|$)/g)) {
    const k = m[1].toLowerCase();
    if (k !== 'img' && !(k in attrs)) attrs[k] = true;
  }
  return attrs;
}

function lookup(src) {
  if (!src) return null;
  const clean = decodeURIComponent(src.split('?')[0].split('#')[0]);
  return manifest[clean] || manifest['/' + clean.replace(/^\.?\//, '')] || null;
}

function srcsetFor(entry, ext) {
  return entry.widths
    .map((w) => `${entry.variants[w][ext]} ${w}w`)
    .join(', ');
}

/** Largest variant at or below 1200px, used as the no-srcset fallback. */
function fallbackWidth(entry) {
  const under = entry.widths.filter((w) => w <= 1200);
  return under.length ? under[under.length - 1] : entry.widths[0];
}

function buildPicture(entry, attrs, sizes, indent) {
  const fw = fallbackWidth(entry);
  const keep = { ...attrs };
  for (const k of ['src', 'srcset', 'sizes', 'width', 'height']) delete keep[k];

  // Preserve author intent on loading/decoding, defaulting to lazy + async.
  if (!('loading' in keep)) keep.loading = 'lazy';
  if (!('decoding' in keep)) keep.decoding = 'async';
  // An eagerly loaded image is the LCP candidate; never lazy-load it.
  if (keep.fetchpriority === 'high') keep.loading = 'eager';

  const attrStr = Object.entries(keep)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${v}"`))
    .join('');

  const i = indent;
  return [
    `<picture>`,
    `${i}  <source type="image/avif" srcset="${srcsetFor(entry, 'avif')}" sizes="${sizes}">`,
    `${i}  <source type="image/webp" srcset="${srcsetFor(entry, 'webp')}" sizes="${sizes}">`,
    `${i}  <img src="${entry.variants[fw].jpg}" srcset="${srcsetFor(entry, 'jpg')}" sizes="${sizes}" width="${entry.width}" height="${entry.height}"${attrStr}>`,
    `${i}</picture>`,
  ].join('\n');
}

function rewriteFile(rel, sizesFn) {
  const abs = path.join(SITE, rel);
  let src = fs.readFileSync(abs, 'utf8');
  const before = src;
  let converted = 0, skippedNoEntry = 0, skippedAlready = 0, skippedLogo = 0;
  let savedFrom = 0;

  src = src.replace(/([ \t]*)(<img\b[^>]*>)/gi, (match, indent, tag, offset) => {
    // Already inside a <picture>? Find the nearest preceding picture boundary.
    const head = src.slice(Math.max(0, offset - 600), offset);
    const lastOpen = head.lastIndexOf('<picture');
    const lastClose = head.lastIndexOf('</picture>');
    if (lastOpen > lastClose) { skippedAlready++; return match; }

    const attrs = parseAttrs(tag);
    if (SKIP_BASENAMES.has(path.basename(attrs.src || ''))) { skippedLogo++; return match; }

    const entry = lookup(attrs.src);
    if (!entry) { skippedNoEntry++; return match; }

    const isHero = /hero|fetchpriority/i.test(tag) || attrs.fetchpriority === 'high';
    const sizes = sizesFn({ isHero, attrs, rel });
    converted++;
    savedFrom += entry.sourceBytes;
    return indent + buildPicture(entry, attrs, sizes, indent);
  });

  if (!DRY && src !== before) fs.writeFileSync(abs, src);
  return { rel, converted, skippedNoEntry, skippedAlready, skippedLogo, savedFrom };
}

/* ---------------------------------------------------------------------- main */

const chosen = targetArg === 'all' ? ['blog', 'service', 'posts'] : [targetArg];
let totalConverted = 0, totalFiles = 0, totalBytes = 0;

for (const name of chosen) {
  const t = TARGETS[name];
  if (!t) { console.error(`Unknown target: ${name}`); process.exit(1); }
  const files = t.files || postFiles();
  console.log(`\n=== ${name} (${files.length} file${files.length === 1 ? '' : 's'}) ===`);
  for (const rel of files) {
    const r = rewriteFile(rel, t.sizes);
    if (r.converted) {
      totalFiles++;
      console.log(`  ${String(r.converted).padStart(3)} converted  ${(r.savedFrom / 1048576).toFixed(2).padStart(6)} MB of originals replaced  ${r.rel}`);
    }
    totalConverted += r.converted;
    totalBytes += r.savedFrom;
  }
}

console.log('\n' + '-'.repeat(64));
console.log(`${totalConverted} <img> tags converted to <picture> across ${totalFiles} files`);
console.log(`${(totalBytes / 1048576).toFixed(2)} MB of original-image references replaced`);
if (DRY) console.log('DRY RUN - nothing written');
