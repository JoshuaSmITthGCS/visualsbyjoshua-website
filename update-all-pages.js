#!/usr/bin/env node
/**
 * Batch update all HTML pages with editorial design
 * Preserves content and SEO, applies new visual system
 */

const fs = require('fs');
const path = require('path');

// Navigation HTML (same across all pages)
const NAV_HTML = `  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-container">
      <a href="/" class="nav-logo">Visuals by Joshua</a>
      <ul class="nav-menu">
        <li><a href="/#portfolio">Portfolio</a></li>
        <li><a href="/blog/photography-pricing/">Pricing</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/blog/best-photo-spots-charleston-sc/">Photo Spots</a></li>
        <li><a href="/#contact">Book Now</a></li>
      </ul>
    </div>
  </nav>`;

// Footer HTML (same across all pages)
const FOOTER_HTML = `  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>Visuals by Joshua</h3>
          <p>Editorial photography for milestones & moments. Serving Charleston SC + Northern VA / DMV. Photographer hourly rates from $80.</p>
          <p style="margin-top: 1.5rem;">
            <a href="tel:+12403608465">(240) 360-8465</a><br>
            <a href="mailto:jbmsmusic05@gmail.com">jbmsmusic05@gmail.com</a>
          </p>
        </div>

        <div class="footer-links">
          <h4>Services</h4>
          <ul>
            <li><a href="/#portfolio">Portfolio</a></li>
            <li><a href="/gallery.html">Full Gallery</a></li>
            <li><a href="/blog/photography-pricing/">Photography Pricing</a></li>
            <li><a href="/FAQ.html">FAQ</a></li>
            <li><a href="/blog/best-photo-spots-charleston-sc/">Best Photo Spots</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <h4>Locations</h4>
          <ul>
            <li><a href="/charleston-photographer/">Charleston SC Photographer</a></li>
            <li><a href="/dmv-photographer/">Northern VA / DMV Photographer</a></li>
            <li><a href="/blog/charleston-graduation-photography/">Graduation Photographer Near Me</a></li>
            <li><a href="/blog.html">Photography Blog</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Visuals by Joshua. Charleston SC & Northern VA photographer. | <a href="/privacy-policy.html">Privacy Policy</a></p>
      </div>
    </div>
  </footer>`;

// Font links for new design
const FONT_LINKS = `  <!-- Fonts: Cormorant Garamond (serif display) + Inter (sans UI) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">`;

function updateBlogPost(filePath) {
  console.log(`Updating: ${filePath}`);
  
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Calculate relative path to root for CSS/JS links
  const depth = filePath.split('/').length - 1;
  const rootPath = depth > 1 ? '../'.repeat(depth - 1) : './';
  
  // Replace old font links with new ones
  html = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*Montserrat[^>]*>/gi,
    ''
  );
  html = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*Playfair[^>]*>/gi,
    ''
  );
  
  // Add new font links if not present
  if (!html.includes('Cormorant+Garamond')) {
    html = html.replace('</head>', `${FONT_LINKS}\n</head>`);
  }
  
  // Replace old CSS links with new ones
  html = html.replace(
    /<link rel="stylesheet" href="[^"]*blog-styles\.css">/gi,
    `<link rel="stylesheet" href="${rootPath}styles.css">`
  );
  html = html.replace(
    /<link rel="stylesheet" href="[^"]*blog-page\.css">/gi,
    ''
  );
  html = html.replace(
    /<link rel="stylesheet" href="[^"]*styles\.css">/gi,
    `<link rel="stylesheet" href="${rootPath}styles.css">`
  );
  
  // Add styles.css link if not present
  if (!html.includes('styles.css')) {
    html = html.replace('</head>', `  <link rel="stylesheet" href="${rootPath}styles.css">\n</head>`);
  }
  
  // Remove old inline blog-hero styles (will be in external CSS now)
  html = html.replace(/<style>\s*\.blog-hero\s*{[^}]+}\s*@media[^}]+{[^}]+}\s*<\/style>/gi, '');
  
  // Add navigation if not present
  if (!html.includes('nav class="nav"')) {
    html = html.replace(/<body[^>]*>/, `<body>\n${NAV_HTML}\n`);
  }
  
  // Replace old article hero with new article hero
  html = html.replace(
    /<section class="blog-hero">/gi,
    '<section class="article-hero"'
  );
  html = html.replace(
    /class="hero-text"/gi,
    'class="article-hero-content"'
  );
  
  // Update blog content wrapper classes
  html = html.replace(
    /<section class="blog-content">/gi,
    '<section class="article-content">'
  );
  
  // Add footer if not present
  if (!html.includes('footer class="footer"')) {
    html = html.replace('</body>', `\n${FOOTER_HTML}\n\n  <script src="${rootPath}scripts.js"></script>\n</body>`);
  } else {
    // Add scripts.js if not present
    if (!html.includes('scripts.js')) {
      html = html.replace('</body>', `  <script src="${rootPath}scripts.js"></script>\n</body>`);
    }
  }
  
  // Write updated HTML
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Updated: ${filePath}`);
}

function updateUtilityPage(filePath) {
  console.log(`Updating utility page: ${filePath}`);
  
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Replace old fonts
  html = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*Montserrat[^>]*>/gi,
    ''
  );
  html = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*Playfair[^>]*>/gi,
    ''
  );
  html = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*Work\+Sans[^>]*>/gi,
    ''
  );
  
  // Add new fonts
  if (!html.includes('Cormorant+Garamond')) {
    html = html.replace('</head>', `${FONT_LINKS}\n</head>`);
  }
  
  // Replace CSS links
  html = html.replace(
    /<link rel="stylesheet" href="[^"]*styles\.css">/gi,
    '<link rel="stylesheet" href="/styles.css">'
  );
  
  // Add styles.css if not present
  if (!html.includes('styles.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/styles.css">\n</head>');
  }
  
  // Add navigation if not present
  if (!html.includes('nav class="nav"')) {
    html = html.replace(/<body[^>]*>/, `<body>\n${NAV_HTML}\n`);
  }
  
  // Add footer if not present
  if (!html.includes('footer class="footer"')) {
    html = html.replace('</body>', `\n${FOOTER_HTML}\n\n  <script src="/scripts.js"></script>\n</body>`);
  } else if (!html.includes('scripts.js')) {
    html = html.replace('</body>', `  <script src="/scripts.js"></script>\n</body>`);
  }
  
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Updated: ${filePath}`);
}

function findAllBlogPosts() {
  const blogPosts = [];
  const blogDir = './blog';
  
  if (fs.existsSync(blogDir)) {
    const entries = fs.readdirSync(blogDir);
    entries.forEach(entry => {
      const entryPath = path.join(blogDir, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        const indexPath = path.join(entryPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          blogPosts.push(indexPath);
        }
      }
    });
  }
  
  return blogPosts;
}

function findAllServicePages() {
  const servicePages = [];
  const serviceDirs = [
    'charleston-photographer',
    'dmv-photographer',
    'charleston-graduation-photographer',
    'charleston-portrait-photographer',
    'charleston-event-photographer',
    'dmv-portrait-photographer',
    'dmv-event-photographer'
  ];
  
  serviceDirs.forEach(dir => {
    const indexPath = path.join('.', dir, 'index.html');
    if (fs.existsSync(indexPath)) {
      servicePages.push(indexPath);
    }
  });
  
  return servicePages;
}

// Main execution
console.log('🎨 Starting batch update of all pages...\n');

// Update utility pages
const utilityPages = ['blog.html', 'gallery.html', 'FAQ.html', 'Testimonials.html'];
console.log('📄 Updating utility pages...');
utilityPages.forEach(page => {
  if (fs.existsSync(page)) {
    updateUtilityPage(page);
  } else {
    console.log(`⚠ Skipping ${page} (not found)`);
  }
});

// Update service pages
console.log('\n🏢 Updating service pages...');
const servicePages = findAllServicePages();
servicePages.forEach(page => updateBlogPost(page));

// Update blog posts
console.log('\n📝 Updating blog posts...');
const blogPosts = findAllBlogPosts();
console.log(`Found ${blogPosts.length} blog posts`);
blogPosts.forEach(post => updateBlogPost(post));

console.log(`\n✅ Complete! Updated ${utilityPages.length + servicePages.length + blogPosts.length} pages`);
console.log('\nNext steps:');
console.log('- Review updated pages');
console.log('- Fix any broken image paths');
console.log('- Update hero background images for blog posts');
console.log('- Run image cropping script to remove text/watermarks');
