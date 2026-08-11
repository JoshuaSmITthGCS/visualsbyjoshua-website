/**
 * Responsive image pipeline for visualsbyjoshua.com
 *
 * Generates AVIF + WebP + JPEG derivatives at 400 / 800 / 1200 / 1600 px wide
 * for every image actually referenced by a served HTML or CSS file, and writes
 * a manifest that the HTML rewrite steps consume.
 *
 *   node optimize-images.mjs            build missing derivatives
 *   node optimize-images.mjs --force    rebuild everything
 *   node optimize-images.mjs --report   report only, write nothing
 *
 * Dependencies deliberately live OUTSIDE the project folder. The site is stored
 * in iCloud Drive, and a node_modules tree there gets torn apart by sync (it
 * produced "sharp 2" and "semver 2" conflict copies and a sharp install with no
 * package.json). Set SHARP_DIR to override the default location.
 *
 *   mkdir -p ~/.visualsbyjoshua-build
 *   cd ~/.visualsbyjoshua-build && npm install sharp@latest
 *
 * Metadata policy: XMP and the ICC profile are preserved so copyright and
 * licensing survive into the derivatives, which ImageObject/licensing schema
 * depends on. EXIF is dropped, because it carries GPS coordinates of client
 * shoots and camera serial numbers that have no business being published.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const DEPS = process.env.SHARP_DIR || path.join(os.homedir(), '.visualsbyjoshua-build');
let sharp;
try {
  sharp = createRequire(path.join(DEPS, 'package.json'))('sharp');
} catch (err) {
  console.error(`\nCould not load sharp from ${DEPS}\n`);
  console.error(`Install it with:\n  mkdir -p "${DEPS}" && cd "${DEPS}" && npm install sharp@latest\n`);
  process.exit(1);
}

const SITE = path.resolve(path.join(import.meta.dirname, '..', '..'));
const OUT_ROOT = path.join(SITE, 'images', 'optimized');
const MANIFEST = path.join(SITE, 'images', 'optimized', 'manifest.json');

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = { avif: 62, webp: 80, jpeg: 80 };
const FORCE = process.argv.includes('--force');
const REPORT_ONLY = process.argv.includes('--report');

const SKIP_DIRS = new Set([
  '_private', '.git', '.seo-audit', '.agents', '.claude', '.vscode',
  'node_modules', 'favicon',
]);

/* ------------------------------------------------------------------ helpers */

const mb = (b) => (b / 1048576).toFixed(2) + ' MB';

function walk(dir, test, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (p.startsWith(OUT_ROOT)) continue;
      walk(p, test, out);
    } else if (test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

/** ref (as written, normalized) -> absolute path on disk */
const resolvedPaths = new Map();

/** Normalize a raw reference to a comparable ref string, or null to ignore it. */
function normalizeRef(raw) {
  if (!raw) return null;
  let r = raw.trim();
  const own = r.match(/^https?:\/\/visualsbyjoshua\.com(\/.*)$/i);
  if (own) r = own[1];
  if (/^(https?:|data:|\/\/|mailto:|tel:)/i.test(r)) return null;
  if (!/\.(webp|jpe?g|png|avif)$/i.test(r)) return null;
  return decodeURIComponent(r.split('?')[0].split('#')[0]);
}

/** Every image referenced from served markup or CSS. */
function collectReferencedImages() {
  const sources = walk(SITE, (n) => /\.(html|css)$/i.test(n));
  const refs = new Set();

  for (const f of sources) {
    const src = fs.readFileSync(f, 'utf8');
    const dir = path.dirname(f);

    const local = new Set();
    for (const m of src.matchAll(/(?:src|href|content)\s*=\s*["']([^"']+)["']/gi)) local.add(m[1]);
    for (const m of src.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi))
      m[1].split(',').forEach((s) => local.add(s.trim().split(/\s+/)[0]));
    for (const m of src.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) local.add(m[1]);

    for (const raw of local) {
      const ref = normalizeRef(raw);
      if (!ref) continue;
      refs.add(ref);
      if (!resolvedPaths.has(ref)) {
        resolvedPaths.set(ref, ref.startsWith('/') ? path.join(SITE, ref) : path.resolve(dir, ref));
      }
    }
  }
  return refs;
}

/**
 * Output group for a source file, keeping basenames from colliding across
 * directories (folklife-traditional-dance.webp exists at the root AND inside a
 * blog post folder).
 */
function groupFor(absSource) {
  const rel = path.relative(SITE, absSource);
  const dir = path.dirname(rel);
  if (dir === '.') return 'root';
  if (dir === 'newblogimages') return 'newblogimages';
  if (dir.startsWith('blog' + path.sep)) return path.join('posts', dir.split(path.sep).slice(1).join('-'));
  if (dir.startsWith('images' + path.sep)) return dir.split(path.sep).slice(1).join('-');
  return dir.replace(/[\\/]/g, '-');
}

/* -------------------------------------------------------------------- build */

const referenced = collectReferencedImages();
const jobs = [];
let missingSource = 0;

for (const ref of referenced) {
  const abs = resolvedPaths.get(ref);
  if (!abs || !fs.existsSync(abs)) { missingSource++; continue; }
  if (abs.startsWith(OUT_ROOT)) continue;           // already a derivative
  jobs.push({ ref, abs });
}
jobs.sort((a, b) => a.ref.localeCompare(b.ref));

console.log(`Site root : ${SITE}`);
console.log(`sharp     : ${sharp.versions.sharp} (libvips ${sharp.versions.vips})`);
console.log(`Sources   : ${jobs.length} referenced images${missingSource ? `, ${missingSource} refs with no file` : ''}`);
console.log(`Widths    : ${WIDTHS.join(', ')}   Formats: avif, webp, jpeg`);
console.log(REPORT_ONLY ? 'Mode      : REPORT ONLY\n' : FORCE ? 'Mode      : FORCE REBUILD\n' : 'Mode      : incremental\n');

const manifest = {};
let built = 0, skipped = 0, srcBytes = 0, outBytes = 0, failed = 0;

for (const { ref, abs } of jobs) {
  let meta;
  try {
    meta = await sharp(abs).metadata();
  } catch (err) {
    console.log(`  FAIL  ${ref}  (${err.message})`);
    failed++;
    continue;
  }

  const stat = fs.statSync(abs);
  srcBytes += stat.size;

  const group = groupFor(abs);
  const base = path.basename(abs).replace(/\.[^.]+$/, '');
  const outDir = path.join(OUT_ROOT, group);

  // Never upscale. Always emit at least one derivative.
  const targets = WIDTHS.filter((w) => w <= meta.width);
  if (targets.length === 0) targets.push(meta.width);

  const entry = {
    source: ref,
    width: meta.width,
    height: meta.height,
    aspectRatio: +(meta.width / meta.height).toFixed(4),
    sourceBytes: stat.size,
    group,
    base,
    widths: targets,
    variants: {},
  };

  if (!REPORT_ONLY) fs.mkdirSync(outDir, { recursive: true });

  for (const w of targets) {
    for (const fmt of ['avif', 'webp', 'jpeg']) {
      const ext = fmt === 'jpeg' ? 'jpg' : fmt;
      const outPath = path.join(outDir, `${base}-${w}.${ext}`);
      const publicPath = '/' + path.relative(SITE, outPath).split(path.sep).join('/');
      (entry.variants[w] ||= {})[ext] = publicPath;

      if (REPORT_ONLY) continue;

      const fresh = fs.existsSync(outPath) &&
        fs.statSync(outPath).mtimeMs >= stat.mtimeMs &&
        fs.statSync(outPath).size > 0;
      if (fresh && !FORCE) { skipped++; outBytes += fs.statSync(outPath).size; continue; }

      let pipeline = sharp(abs, { failOn: 'none' })
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .keepXmp()
        .keepIccProfile();

      if (fmt === 'avif') pipeline = pipeline.avif({ quality: QUALITY.avif, effort: 4 });
      else if (fmt === 'webp') pipeline = pipeline.webp({ quality: QUALITY.webp });
      else pipeline = pipeline.jpeg({ quality: QUALITY.jpeg, mozjpeg: true });

      try {
        const info = await pipeline.toFile(outPath);
        outBytes += info.size;
        built++;
      } catch (err) {
        console.log(`  FAIL  ${publicPath}  (${err.message})`);
        failed++;
      }
    }
  }

  manifest[ref] = entry;
}

if (!REPORT_ONLY) {
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
}

/* ------------------------------------------------------------------ summary */

const smallest = Object.values(manifest).reduce((acc, e) => {
  const w = e.widths[0];
  const p = e.variants[w]?.avif;
  if (!p) return acc;
  const abs = path.join(SITE, p.slice(1));
  return acc + (fs.existsSync(abs) ? fs.statSync(abs).size : 0);
}, 0);

console.log('\n' + '-'.repeat(64));
console.log(`built ${built} derivatives, skipped ${skipped} fresh, ${failed} failed`);
console.log(`source images on disk        ${mb(srcBytes)}`);
if (!REPORT_ONLY) console.log(`all derivatives on disk      ${mb(outBytes)}`);
console.log(`sum of smallest AVIF variant ${mb(smallest)}   <- what a 400px viewport downloads`);
console.log(`manifest                     ${path.relative(SITE, MANIFEST)} (${Object.keys(manifest).length} entries)`);
