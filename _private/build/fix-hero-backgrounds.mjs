/**
 * Optimize the CSS background hero on blog posts.
 *
 *   node fix-hero-backgrounds.mjs [--dry]
 *
 * Every post renders its hero as a CSS background on .blog-hero, declared in the
 * post's own inline <style>. Because it is a background and not an <img>, the
 * <picture>/srcset rewrite cannot reach it, yet it is the Largest Contentful
 * Paint element on all 55 posts and several point at multi-megabyte originals.
 *
 * A background image cannot use srcset, so this uses two mechanisms instead:
 *
 *   1. image-set() with type() so the browser picks AVIF, then WebP, then JPEG.
 *      A plain url() declaration is emitted first as the fallback for engines
 *      without image-set support; the later declaration wins where supported.
 *   2. A min-width media query, because image-set cannot select on viewport
 *      width. Phones get the 800px variant, desktop the 1600px one.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = path.resolve(path.join(import.meta.dirname, '..', '..'));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(SITE, 'images', 'optimized', 'manifest.json'), 'utf8'));
const DRY = process.argv.includes('--dry');

const mb = (b) => (b / 1048576).toFixed(2);
const pick = (entry, want) => {
  const ok = entry.widths.filter((w) => w <= want);
  return ok.length ? ok[ok.length - 1] : entry.widths[0];
};

let changed = 0, before = 0, afterMobile = 0, skipped = 0;

for (const slug of fs.readdirSync(path.join(SITE, 'blog'))) {
  const rel = path.join('blog', slug, 'index.html');
  const abs = path.join(SITE, rel);
  if (!fs.existsSync(abs)) continue;

  let src = fs.readFileSync(abs, 'utf8');

  // The .blog-hero rule, and the background declaration inside it.
  const block = src.match(/([ \t]*)\.blog-hero\s*\{([\s\S]*?)\}/);
  if (!block) { skipped++; continue; }
  const [blockAll, indent, body] = block;

  if (/image-set\(/.test(body)) { skipped++; continue; }   // already done

  const decl = body.match(/([ \t]*)background:\s*([^;]*?)url\(\s*'?([^')]+)'?\s*\)([^;]*);/);
  if (!decl) { skipped++; continue; }
  const [declAll, declIndent, prefix, url, suffix] = decl;

  // Resolve relative urls against the post directory.
  const key = url.startsWith('/')
    ? url
    : '/' + path.posix.join('blog', slug, url);
  const entry = MANIFEST[key];
  if (!entry) { skipped++; continue; }

  const origAbs = path.join(SITE, key.replace(/^\//, ''));
  const origBytes = fs.existsSync(origAbs) ? fs.statSync(origAbs).size : 0;

  const wMobile = pick(entry, 800);
  const wDesktop = pick(entry, 1600);
  const v = (w, ext) => entry.variants[w][ext];

  const set = (w) =>
    `image-set(url('${v(w, 'avif')}') type('image/avif'), url('${v(w, 'webp')}') type('image/webp'), url('${v(w, 'jpg')}') type('image/jpeg'))`;

  const newDecl =
    `${declIndent}background: ${prefix}url('${v(wMobile, 'jpg')}')${suffix};\n` +
    `${declIndent}background: ${prefix}${set(wMobile)}${suffix};`;

  const newBody = body.replace(declAll, newDecl);
  const mediaRule =
    `\n${indent}@media (min-width: 800px) {\n` +
    `${indent}  .blog-hero {\n` +
    `${indent}    background: ${prefix}url('${v(wDesktop, 'jpg')}')${suffix};\n` +
    `${indent}    background: ${prefix}${set(wDesktop)}${suffix};\n` +
    `${indent}  }\n` +
    `${indent}}`;

  src = src.replace(blockAll, `${indent}.blog-hero {${newBody}}${mediaRule}`);
  if (!DRY) fs.writeFileSync(abs, src);

  const mobileBytes = fs.statSync(path.join(SITE, v(wMobile, 'avif').replace(/^\//, ''))).size;
  before += origBytes;
  afterMobile += mobileBytes;
  changed++;
  console.log(`  ${mb(origBytes).padStart(6)} MB -> ${mb(mobileBytes).padStart(5)} MB  ${slug}`);
}

console.log('\n' + '-'.repeat(64));
console.log(`${changed} hero backgrounds rewritten, ${skipped} skipped (no match, no manifest entry, or already done)`);
console.log(`hero LCP bytes on mobile: ${mb(before)} MB -> ${mb(afterMobile)} MB`);
if (DRY) console.log('DRY RUN - nothing written');
