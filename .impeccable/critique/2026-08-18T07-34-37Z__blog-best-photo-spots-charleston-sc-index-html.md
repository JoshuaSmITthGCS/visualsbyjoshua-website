---
target: blog/best-photo-spots-charleston-sc/index.html
total_score: 16
max_score: 32
na_heuristics: 9,10
p0_count: 3
p1_count: 2
timestamp: 2026-08-18T07-34-37Z
slug: blog-best-photo-spots-charleston-sc-index-html
---
# Design Critique: Best Photo Spots Charleston SC

**Target**: blog/best-photo-spots-charleston-sc/index.html
**Mode**: Read (Blog article)
**Date**: 2026-08-18

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | FAQ items all expanded—no toggle affordance |
| 2 | Match System / Real World | 2 | Title says "Photo Spots" but kicker says "Photography Guide"—unclear framing |
| 3 | User Control and Freedom | 3 | No back-to-top on 579-line page; FAQ can't collapse |
| 4 | Consistency and Standards | 1 | TWO navs, TWO footers, TWO serif fonts (Playfair vs Cormorant), TWO color systems (blue vs tan) |
| 5 | Error Prevention | 3 | External links use rel="noopener" correctly |
| 6 | Recognition Rather Than Recall | 2 | TOC anchors don't match section headers; stat grid presents disconnected facts |
| 7 | Flexibility and Efficiency | 2 | TOC provides jump links but no skip-to-main or print stylesheet |
| 8 | Aesthetic and Minimalist Design | 0 | Duplicate navs/footers, competing color systems, gray boxes + dark quote block, excessive visual noise |
| 9 | Help Users Recognize/Recover | n/a | Read mode—no error states |
| 10 | Help and Documentation | n/a | Read mode—help lives in FAQ (expanded by default) |
| Total | | 16/32 | Poor (50%) |

## Design Specificity

Two conflicting design systems: old "guide" components (Playfair, blue #3498db, gray boxes) vs new editorial (Cormorant, tan #be976d, warm neutrals). Feels category-interchangeable.

Detector found 7 issues: 4× side-tab borders (AI slop), 2× low-contrast (a11y), 1× flat type hierarchy.

## Priority Issues

### P0 Issues
1. No images on photography blog about photo locations
2. Duplicate navigation bars (two complete <nav> elements)
3. Duplicate footers (two complete <footer> blocks)

### P1 Issues
4. Conflicting design systems (Playfair vs Cormorant, blue vs tan)
5. Low-contrast accessibility failures (1.3:1 and 1.0:1)

### P2 Issues
6. Stat grid disconnected from content

## Strengths
- Comprehensive Schema.org markup (BlogPosting + BreadcrumbList)
- FAQ structure answers search intent directly
- External citations build trust

## Persona Red Flags
- Jordan (First-Timer): Confused by design system switch, no visual examples
- Casey (Mobile): Double nav/footer waste vertical space, no back-to-top
