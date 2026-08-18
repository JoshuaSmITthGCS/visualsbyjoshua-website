#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fixCSSPath(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Count directory depth
  const parts = filePath.split('/');
  const depth = parts.length - 1;
  
  // Root-relative path is best
  const cssPath = '/styles.css';
  const jsPath = '/scripts.js';
  
  // Replace relative CSS paths with root-relative
  html = html.replace(
    /<link[^>]*href=["']\.\.\/\.\.\/styles\.css["'][^>]*>/gi,
    '<link rel="stylesheet" href="/styles.css">'
  );
  html = html.replace(
    /<link[^>]*href=["']\.\.\/styles\.css["'][^>]*>/gi,
    '<link rel="stylesheet" href="/styles.css">'
  );
  html = html.replace(
    /<link[^>]*href=["']\.\/styles\.css["'][^>]*>/gi,
    '<link rel="stylesheet" href="/styles.css">'
  );
  
  // Ensure styles.css is present
  if (!html.includes('href="/styles.css"') && !html.includes("href='/styles.css'")) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/styles.css">\n</head>');
    updated = true;
  }
  
  // Replace relative JS paths with root-relative
  html = html.replace(
    /<script[^>]*src=["']\.\.\/\.\.\/scripts\.js["'][^>]*>/gi,
    '<script src="/scripts.js"></script>'
  );
  html = html.replace(
    /<script[^>]*src=["']\.\.\/scripts\.js["'][^>]*>/gi,
    '<script src="/scripts.js"></script>'
  );
  
  // Ensure scripts.js is at the end of body
  if (!html.includes('src="/scripts.js"') && !html.includes("src='/scripts.js'")) {
    html = html.replace('</body>', '  <script src="/scripts.js"></script>\n</body>');
    updated = true;
  }
  
  fs.writeFileSync(filePath, html, 'utf8');
  return updated || html !== fs.readFileSync(filePath, 'utf8');
}

// Fix all blog posts
const blogDir = './blog';
if (fs.existsSync(blogDir)) {
  const entries = fs.readdirSync(blogDir);
  entries.forEach(entry => {
    const indexPath = path.join(blogDir, entry, 'index.html');
    if (fs.existsSync(indexPath)) {
      fixCSSPath(indexPath);
    }
  });
}

// Fix utility pages
['blog.html', 'gallery.html', 'FAQ.html', 'Testimonials.html'].forEach(page => {
  if (fs.existsSync(page)) {
    fixCSSPath(page);
  }
});

// Fix service pages
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
  const indexPath = path.join(dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    fixCSSPath(indexPath);
  }
});

console.log('✅ Fixed CSS paths - all pages now use root-relative paths (/styles.css, /scripts.js)');
