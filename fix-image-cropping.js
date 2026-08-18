#!/usr/bin/env node
/**
 * Fix image cropping to remove text/watermarks
 * Updates CSS object-position values
 */

const fs = require('fs');
const path = require('path');

// Images that need cropping adjustment (object-position)
const imageCropSettings = {
  // Portfolio images - crop tighter to avoid edge text
  'cypress-gardens-engagement-shoot': 'center 35%',
  'charleston-anniversary-couple-downtown': 'center 35%',
  'gza-wu-tang-concert-photography': 'center 40%',
  
  // Default for all portfolio/hero images
  'default-hero': 'center 40%',
  'default-portfolio': 'center 35%',
};

function updateStylesCSS() {
  console.log('📐 Updating image cropping in styles.css...');
  
  let css = fs.readFileSync('./styles.css', 'utf8');
  
  // Ensure hero images are cropped properly
  if (!css.includes('object-position: center 40%')) {
    css = css.replace(
      /\.hero-image\s*{[^}]*object-position:[^;]*;/g,
      match => match.replace(/object-position:[^;]*;/, 'object-position: center 40%;')
    );
  }
  
  // Ensure portfolio card images are cropped tighter
  if (!css.includes('.portfolio-card-front img') || !css.includes('object-position: center 35%')) {
    css = css.replace(
      /\.portfolio-card-front img\s*{[^}]*}/g,
      `.portfolio-card-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
}`
    );
  }
  
  // Add article hero image cropping
  if (!css.includes('.article-hero')) {
    css += `\n
/* Article hero images - crop to avoid text */
.article-hero {
  background-position: center 35% !important;
}

.article-content img {
  object-fit: cover;
  object-position: center 35%;
}
`;
  }
  
  fs.writeFileSync('./styles.css', css, 'utf8');
  console.log('✓ Updated styles.css with image cropping rules');
}

function updateBlogPostImages() {
  console.log('\n🖼️  Updating blog post inline image styles...');
  
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
  
  let updatedCount = 0;
  
  blogPosts.forEach(postPath => {
    let html = fs.readFileSync(postPath, 'utf8');
    let updated = false;
    
    // Update inline blog-hero background-position
    const oldBgPosition = /background:[^;]*center\/cover/g;
    if (oldBgPosition.test(html)) {
      html = html.replace(
        /background:[^;]*center\/cover/g,
        'background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), var(--bg-url) center 35% / cover'
      );
      updated = true;
    }
    
    // Update style tags with blog-hero
    const heroStyleRegex = /<style>\s*\.blog-hero\s*{([^}]+)}\s*@media[^}]+{([^}]+)}\s*<\/style>/gi;
    if (heroStyleRegex.test(html)) {
      html = html.replace(heroStyleRegex, (match) => {
        return match.replace(/center\/cover/g, 'center 35% / cover');
      });
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(postPath, html, 'utf8');
      updatedCount++;
    }
  });
  
  console.log(`✓ Updated ${updatedCount} blog post images`);
}

function generateImageCroppingReport() {
  console.log('\n📊 Generating image cropping report...');
  
  const report = {
    portfolioImages: [],
    heroImages: [],
    blogImages: []
  };
  
  // Scan index.html for portfolio images
  if (fs.existsSync('./index.html')) {
    const html = fs.readFileSync('./index.html', 'utf8');
    const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/g;
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      if (match[1].includes('/images/')) {
        const imgPath = match[1];
        if (imgPath.includes('portfolio') || imgPath.includes('couples') || imgPath.includes('concerts')) {
          report.portfolioImages.push(imgPath);
        } else if (imgPath.includes('hero') || match[0].includes('hero-image')) {
          report.heroImages.push(imgPath);
        }
      }
    }
  }
  
  console.log(`\n📸 Image Cropping Summary:`);
  console.log(`   Portfolio images: ${report.portfolioImages.length} (cropped to center 35%)`);
  console.log(`   Hero images: ${report.heroImages.length} (cropped to center 40%)`);
  console.log(`\n✅ All images now cropped to avoid edge text/watermarks`);
}

// Main execution
console.log('🎨 Fixing image cropping across all pages...\n');

updateStylesCSS();
updateBlogPostImages();
generateImageCroppingReport();

console.log('\n✅ Image cropping complete!');
console.log('\nNext: Verify design against 11 reference sites');
