# DESIGN.md

<!-- impeccable:design-schema 1 -->

## Visual Authority

**User-pinned direction** modeled after 11 photographer reference websites:

1. reesemoorephotography.com
2. mcgphotography.com
3. chrismanstudios.com
4. taylormickal.com
5. anaisabelphotography.com
6. chipdizard.com
7. enphotoco.com
8. erinrosephoto.com
9. timcoburnphoto.com
10. ariellelewis.com
11. hopetaylor.com

**Position**: #1 on grounded list (user-validated photographer editorial aesthetic)
**Seed key**: `user-pinned-photographer-editorial-2026-08-18`

---

## Direction Contract

### Thesis

Portfolio-first photography homepage that lets work speak before words. Refuses the generic service-business template (standard hero-CTA-services grid) in favor of editorial magazine layouts where full-bleed images dominate and asymmetric grids create visual rhythm.

### Visual World

Warm neutrals (#fcfbfa background, #2a2a2a text, #be976d accent tan), Cormorant Garamond serif display + Inter sans UI, full-width asymmetric image grids, generous whitespace (80-120px vertical rhythm), 10px border-radius on interactive elements, minimal shadows (only 0-2px on hover), smooth 0.3s transitions, image hover zoom to 105%, rotating hero background (8s interval).

### Story

Visitor lands on full-screen hero with rotating portfolio images (couples, concerts, graduation), scrolls into masonry portfolio grid with flip-card effect revealing blog posts, discovers service cards with clear pricing, reads about section with GZA/Wu-Tang credibility, and books via streamlined form with real-time validation.

### First Viewport

Full-bleed rotating hero (100vw × 85vh) cycling through 4 portfolio images every 8 seconds. Minimal overlay: "Visuals by Joshua" wordmark top-left (56px Cormorant italic, #ffffff with subtle shadow), centered tagline "Editorial photography for milestones & moments" (18px Inter, letter-spacing 0.15em, uppercase), "Charleston + DMV" location line below, and one ghosted CTA bottom-center ("View Portfolio" border-only button). Navigation menu at top with 5 links.

---

## Color Palette

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#fcfbfa` | Body background, form inputs |
| Text Primary | `#2a2a2a` | Headings, body copy, navigation |
| Accent Tan | `#be976d` | CTAs, hover states, kickers, prices |
| Accent Tan Dark | `#a67f5a` | Hover state for primary buttons |
| White | `#ffffff` | Hero overlay text, dark backgrounds |

### Neutral Palette

| Token | Value | Usage |
|-------|-------|-------|
| Text Secondary | `#5a5a5a` | Body copy, descriptions |
| Text Tertiary | `#7a7a7a` | Price notes, metadata |
| Border | `#d8d8d8` | Form inputs, default borders |
| Border Light | `#e8e8e8` | Service cards, dividers |
| Card Background | `#f5f3f0` | Service tags, about credibility badge |
| Pure White | `#ffffff` | Services section background |

### Dark Mode Elements

| Token | Value | Usage |
|-------|-------|-------|
| Footer Background | `#2a2a2a` | Footer, flip card backs |
| Footer Text | `#ffffff` | Footer copy, flip card back text |

---

## Typography

### Font Stack

**Display (Serif)**: `'Cormorant Garamond', Georgia, serif`
**UI (Sans)**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Type Scale

| Element | Font | Size | Weight | Style | Letter-spacing |
|---------|------|------|--------|-------|----------------|
| Hero Logo | Cormorant | `clamp(3.5rem, 7vw, 5.5rem)` | 400 | italic | -0.02em |
| H1 | Cormorant | `clamp(3rem, 6vw, 5rem)` | 600 | italic | -0.02em |
| H2 | Cormorant | `clamp(2rem, 4vw, 3.5rem)` | 600 | normal | default |
| H3 | Cormorant | `clamp(1.5rem, 3vw, 2rem)` | 600 | normal | default |
| Service Title | Cormorant | 1.75rem | 600 | normal | default |
| Service Price | Inter | 2rem | 600 | normal | default |
| Body Text | Inter | 1rem | 400 | normal | default |
| Hero Tagline | Inter | `clamp(0.875rem, 2vw, 1.125rem)` | 400 | normal | 0.15em |
| Kicker | Inter | 0.875rem | 500 | normal | 0.15em (uppercase) |
| Nav Links | Inter | 0.9375rem | 500 | normal | 0.05em (uppercase) |
| Button Text | Inter | 0.9375rem | 500 | normal | 0.05em (uppercase) |

### Line Height

- **Headings**: 1.2
- **Body Text**: 1.8
- **Body (general)**: 1.6

### Max-Width

- **Body Text**: 65ch (optimal line length)

---

## Spacing System

### Vertical Rhythm

- **Section Padding**: `clamp(60px, 10vw, 120px)` top/bottom
- **About Section**: `clamp(80px, 12vw, 140px)` top/bottom
- **Footer**: `60px 0 30px`

### Horizontal Padding

- **Container**: `0 clamp(20px, 5vw, 80px)`
- **Navigation**: `20px clamp(20px, 5vw, 80px)`

### Component Spacing

- **Grid Gap (Portfolio)**: 20px
- **Grid Gap (Services)**: 40px
- **Grid Gap (Footer)**: 40px
- **Navigation Links**: 40px gap
- **Form Grid Gap**: 24px

### Max-Width

- **Container**: 1400px
- **Contact Form**: 700px
- **Contact Intro**: 700px

---

## Components

### Navigation

**Fixed position** at top, `rgba(252, 251, 250, 0.95)` background with `backdrop-filter: blur(10px)`.

- Logo: 1.5rem Cormorant italic, #2a2a2a
- Links: 0.9375rem Inter, 500 weight, 0.05em letter-spacing, uppercase
- Hover: color changes to #be976d
- Border: 1px solid rgba(42, 42, 42, 0.1) bottom

### Buttons

**Base**: 14px 32px padding, 0.9375rem, 500 weight, 0.05em letter-spacing, uppercase, 10px border-radius, 0.3s transition

| Variant | Background | Text | Border | Hover Effect |
|---------|-----------|------|--------|--------------|
| `.btn-ghost` | transparent | #ffffff | 2px solid rgba(255,255,255,0.9) | background: rgba(255,255,255,0.15) |
| `.btn-primary` | #be976d | #ffffff | 2px solid #be976d | bg: #a67f5a, translateY(-2px), shadow: 0 4px 12px rgba(190,151,109,0.3) |
| `.btn-secondary` | transparent | #2a2a2a | 2px solid #2a2a2a | bg: #2a2a2a, text: #fcfbfa |

### Hero

- **Dimensions**: 100vw × 85vh, min-height 600px
- **Background**: 4 rotating images, 8s interval
- **Transition**: opacity 1.5s ease-in-out between images
- **Overlay**: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)
- **Image position**: object-position center 40%

### Portfolio Grid

- **Grid**: `repeat(auto-fit, minmax(min(100%, 350px), 1fr))` → `repeat(3, 1fr)` @768px
- **Aspect ratio**: 4/5
- **Flip card**: `perspective: 1000px`, `transform-style: preserve-3d`, 0.6s transform
- **Hover**: `rotateY(180deg)`
- **Image cropping**: `object-position: center 35%` (tighter crop to avoid edge artifacts)
- **Border radius**: 10px

### Service Cards

- **Padding**: 40px 30px
- **Border**: 1px solid #e8e8e8
- **Border radius**: 10px
- **Hover**: border-color #be976d, box-shadow 0 4px 20px rgba(0,0,0,0.08), translateY(-4px)
- **Tag**: 6px 14px padding, #f5f3f0 background, 20px border-radius, 0.75rem, 0.1em letter-spacing, uppercase

### Form

- **Input padding**: 14px 18px
- **Border**: 1px solid #d8d8d8
- **Border radius**: 10px
- **Background**: #fcfbfa → #ffffff on focus
- **Focus state**: border-color #be976d, box-shadow 0 0 0 3px rgba(190,151,109,0.1)
- **Textarea min-height**: 140px

---

## Motion Grammar

### Transitions

- **Default**: `0.3s ease` (links, buttons, cards)
- **Hero Image Fade**: `1.5s ease-in-out` (opacity)
- **Flip Card**: `0.6s` (transform)

### Hover Effects

- **Links**: opacity 0.7
- **Primary Button**: translateY(-2px) + shadow
- **Service Card**: translateY(-4px) + shadow
- **Nav Links**: color change to #be976d (no opacity change)

### Animations

- **Hero Rotation**: 8000ms interval, JavaScript-driven class toggle
- **Flip Card**: CSS 3D transform on hover (rotateY 180deg)

### Timing

- **Fast**: 300ms (general transitions)
- **Medium**: 600ms (flip card)
- **Slow**: 1500ms (hero fade), 8000ms (hero rotation)

---

## Layout Primitives

### Container

```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 80px);
}
```

### Section

```css
.section {
  padding: clamp(60px, 10vw, 120px) 0;
}
```

### Grids

**Portfolio**: `repeat(auto-fit, minmax(min(100%, 350px), 1fr))` → `repeat(3, 1fr)` @768px, 20px gap

**Services**: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, 40px gap

**Form**: Single column → 2 columns @600px, 24px gap

**About**: 1fr → `1fr 1.2fr` @900px, 60px gap

---

## Shadows

**Minimal shadow philosophy** - only used on hover states:

- **Primary Button Hover**: `0 4px 12px rgba(190, 151, 109, 0.3)`
- **Service Card Hover**: `0 4px 20px rgba(0, 0, 0, 0.08)`
- **Form Focus**: `0 0 0 3px rgba(190, 151, 109, 0.1)` (not a true shadow, focus ring)

**No shadows** on default states. Elevation through borders and background color only.

---

## Border Radius

**Consistent 10px** across all interactive elements:

- Buttons
- Service cards
- Form inputs
- Portfolio cards (flip cards)
- About image
- About credibility badge

**Exception**: Service tags use 20px (pill shape)

---

## Responsive Breakpoints

| Breakpoint | Target | Changes |
|------------|--------|---------|
| 768px | Tablet | Hide nav menu (mobile), change portfolio grid to 3 columns |
| 900px | Desktop | About section 2-column layout (1fr 1.2fr) |
| 600px | Small tablet | Form grid 2 columns |

**Fluid scaling** via `clamp()` for typography and spacing eliminates need for many breakpoints.

---

## SEO Integration

### Schema.org

Preserves all existing structured data:
- LocalBusiness + ProfessionalService
- Person schema
- 4 Review objects with 5-star ratings
- OfferCatalog with 6 service offerings
- areaServed covering Charleston cities + DMV regions

### Target Keywords (High-Impression, Low-CTR Optimization)

Naturally integrated into:
- Page title: "Charleston Photography Pricing | Graduation & Event Photographer Near Me"
- Meta description
- H2 headings: "How Much Does a Photographer Cost?"
- Service descriptions
- Alt text
- Schema.org service descriptions

**Primary queries**:
- "graduation photographer near me"
- "photography hourly rate"
- "photographer cost"
- "best photo spots charleston sc"
- "birthday photoshoot near me"
- "event coverage photography"

---

## Image Strategy

### Hero Images

4 rotating images:
1. Cypress Gardens engagement shoot
2. GZA concert photography
3. Charleston graduation portraits
4. Downtown anniversary couple session

**Loading**: first image `loading="eager" fetchpriority="high"`, rest `loading="lazy"`

### Portfolio Grid

8 flip cards linking to blog posts, all `loading="lazy"`

**Cropping**: `object-position: center 35%` to eliminate edge artifacts (user requested tighter crop)

---

## Form Backend

**FormSubmit.co** integration preserved:

- Action: `https://formsubmit.co/jbmsmusic05@gmail.com`
- Hidden fields: `_subject`, `_next`, `_template`, `_captcha`
- Redirect: `thank-you.html`
- JavaScript validation: email regex check before submit

---

## Accessibility

- Semantic HTML (nav, section, footer)
- Proper heading hierarchy (h1 → h2 → h3)
- Form labels with `for` attributes
- Alt text on all images
- Focus states with visible outline (form inputs)
- Color contrast: #2a2a2a on #fcfbfa (high contrast)
- Smooth scroll behavior: `scroll-behavior: smooth`

---

## Brand Credibility

**GZA/Wu-Tang Clan** mention preserved as key differentiator:

- About section: "I've shot event coverage photography for artists like GZA (Wu-Tang Clan)"
- Service card: "Shot for GZA (Wu-Tang Clan)"
- Credibility badge: 🎤 icon + "Shot for GZA (Wu-Tang Clan)"
- Schema.org Concert Photography service description

---

## Performance

- Lazy loading on all images except hero primary
- Minimal JavaScript (hero rotation, smooth scroll, form validation)
- No external dependencies beyond Google Fonts
- Static HTML/CSS (no framework overhead)
- `font-display: swap` (implied by Google Fonts URL structure)

---

## Finish Review Checklist

- [x] Design system documented in DESIGN.md
- [x] Direction contract preserved (CSS comments + HTML comments)
- [x] All 11 photographer reference sites analyzed and patterns extracted
- [x] SEO work preserved (Schema.org, meta tags, target keywords)
- [x] FormSubmit.co backend intact
- [x] Navigation menu implemented (5 links)
- [x] Rotating hero background (4 images, 8s interval, smooth fade)
- [x] Flip cards with blog post reveals
- [x] Images cropped tighter (object-position center 35%)
- [x] GZA/Wu-Tang credibility featured
- [x] Responsive across breakpoints (768px, 900px)
- [x] Form validation with email regex
- [ ] Codex verification against 11 reference sites (awaiting DESIGN.md review)

---

**Last updated**: 2026-08-18
**Version**: 1.0.0
**Seed**: user-pinned-photographer-editorial-2026-08-18
