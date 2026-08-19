# Blog Redesign — Status & What Needs Your Input

All 56 blog posts now use the new design (the one from the Cypress Gardens engagement post you approved): collapsible table of contents, collapsible FAQ, pull-quotes, scroll-reveal animations, and a consistent footer across every page. The blog index page (`/blog.html`) now lists and lets you filter all 56 posts by category — it only showed 16 before.

## 1. One photo needs a higher-resolution replacement

**`headshot1.webp`** is only 475×712px — noticeably small for a hero/header image. It's used on:
- `/blog/charleston-headshot-guide/`
- `/blog/charleston-headshot-pricing/`

There's no larger version of this photo anywhere in the repo or its history. If you have the original file (or a better export) from this shoot, upload a version at least 1200px on the long edge and I'll wire it into both posts, including the responsive `-400/-800/-1200` derivatives.

## 2. Raw photo uploads you added — optional next step

You uploaded four folders of raw shoot photos directly to the repo root:

- `A Shutter drag/` (5 images)
- `A Sullivan's Island Session/` (9 images)
- `A Studio Silhouette/` (7 images)
- `A Wutang black and white/` (13 images)

Good news: the corresponding blog posts (`shutter-drag-creative-portrait-photography`, `sullivans-island-birthday-portrait-photography-charleston`, `studio-black-white-portrait-photography`, `concert-photography-gza-wu-tang`) already use high-resolution hero images, so nothing is broken or blocking. These new uploads are extra material — I didn't touch them.

If you'd like, I can build proper `-400/-800/-1200` derivatives from a few of these and drop them into those posts as additional inline gallery photos (most currently have just one hero image and no in-article photos). Just say the word and which folders/posts you want expanded.

## 3. Everything else is done

- All 56 posts share the same header, footer, typography, and color system.
- Footer is now identical across every post, the blog index, and the homepage (fixed a stray "Best Photo Spots" link that didn't match the rest of the site).
- Every post was validated: FAQ text matches its schema exactly, all JSON-LD is valid, internal/external link counts are sane, and no original content was deleted — only restructured visually.
- A couple of very content-rich posts (lightroom-black-skin-tones-workflow, flash-fill-harsh-sun-settings, tamron-28-75-g2-vs-a036-real-world) genuinely have 7 real sections instead of the usual 4–6 — I left them as-is rather than cutting content to hit a number.
- Fixed one small pre-existing bug along the way: a FAQ answer on the ttartisan fisheye post had a raw `&quot;` typo in its schema instead of an actual quote mark.
