#!/usr/bin/env node
const fs = require('fs');

let html = fs.readFileSync('./index.html', 'utf8');

// 1. Add Stats Section after About section
const statsSection = `
  <!-- Stats -->
  <section class="stats section" style="background: #ffffff;">
    <div class="container">
      <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center;">
        <div class="stat-item">
          <div class="stat-number" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 3.5rem; font-weight: 600; color: #be976d; margin-bottom: 0.5rem;">70+</div>
          <div class="stat-label" style="font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; color: #5a5a5a;">Happy Clients</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 3.5rem; font-weight: 600; color: #be976d; margin-bottom: 0.5rem;">8+</div>
          <div class="stat-label" style="font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; color: #5a5a5a;">Years Experience</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 3.5rem; font-weight: 600; color: #be976d; margin-bottom: 0.5rem;">10k+</div>
          <div class="stat-label" style="font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; color: #5a5a5a;">Photos Delivered</div>
        </div>
      </div>
    </div>
  </section>
`;

html = html.replace('</section>\n\n  <!-- Contact Form', statsSection + '\n\n  <!-- Contact Form');

// 2. Add Reviews/Testimonials Section after Contact Form
const reviewsSection = `
  <!-- Reviews / Testimonials -->
  <section class="reviews section" style="background: #ffffff;">
    <div class="container">
      <div class="text-center" style="margin-bottom: 60px;">
        <span class="kicker">Testimonials</span>
        <h2>What Clients Say</h2>
      </div>
      
      <div class="reviews-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 30px;">
        <div class="review-card" style="padding: 30px; background: #fcfbfa; border-radius: 10px; border: 1px solid #e8e8e8;">
          <div style="color: #be976d; font-size: 1.5rem; margin-bottom: 1rem;">★★★★★</div>
          <p style="font-size: 0.9375rem; line-height: 1.7; color: #5a5a5a; margin-bottom: 1.5rem; max-width: 100%;">"Joshua did a great job with my graduation photos. He positioned me well, listened to what I wanted, and delivered 30 edited professional photos within 2 days. Fully recommend Joshua for any photography needs."</p>
          <div style="font-weight: 600; color: #2a2a2a;">Micah Watson</div>
          <div style="font-size: 0.875rem; color: #7a7a7a;">Graduation Photography</div>
        </div>
        
        <div class="review-card" style="padding: 30px; background: #fcfbfa; border-radius: 10px; border: 1px solid #e8e8e8;">
          <div style="color: #be976d; font-size: 1.5rem; margin-bottom: 1rem;">★★★★★</div>
          <p style="font-size: 0.9375rem; line-height: 1.7; color: #5a5a5a; margin-bottom: 1.5rem; max-width: 100%;">"My photoshoot was great. Josh was patient and kind as I changed scenery and outfits, and he helped with poses when I could not think of any. Highly recommend for high-quality pictures at a reasonable price."</p>
          <div style="font-weight: 600; color: #2a2a2a;">Jayla G.</div>
          <div style="font-size: 0.875rem; color: #7a7a7a;">Portrait Session</div>
        </div>
        
        <div class="review-card" style="padding: 30px; background: #fcfbfa; border-radius: 10px; border: 1px solid #e8e8e8;">
          <div style="color: #be976d; font-size: 1.5rem; margin-bottom: 1rem;">★★★★★</div>
          <p style="font-size: 0.9375rem; line-height: 1.7; color: #5a5a5a; margin-bottom: 1.5rem; max-width: 100%;">"The best photos ever. I got so many compliments on my photos, and Josh understood exactly what I wanted them to look like. I would absolutely book with him again."</p>
          <div style="font-weight: 600; color: #2a2a2a;">Reema A.</div>
          <div style="font-size: 0.875rem; color: #7a7a7a;">Personal Branding</div>
        </div>
      </div>
      
      <div class="text-center" style="margin-top: 40px;">
        <a href="/Testimonials.html" class="btn btn-secondary">Read More Testimonials</a>
      </div>
    </div>
  </section>
`;

// 3. Add Blog Guides Section
const blogGuidesSection = `
  <!-- GUIDES From the Blog -->
  <section class="blog-guides section">
    <div class="container">
      <div class="text-center" style="margin-bottom: 60px;">
        <span class="kicker">GUIDES</span>
        <h2>From the Blog</h2>
        <p style="margin: 0 auto; color: #5a5a5a; max-width: 700px;">Local guides and planning tips to help you prepare for your session or event.</p>
        <a href="/blog.html" style="color: #be976d; font-weight: 500; margin-top: 1rem; display: inline-block;">See recent guides →</a>
      </div>
      
      <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr)); gap: 30px;">
        <div class="blog-card" style="border-radius: 10px; overflow: hidden; border: 1px solid #e8e8e8; transition: transform 0.3s ease, box-shadow 0.3s ease;">
          <img src="/images/optimized/events/charleston-juneteenth-event-photography-1200.webp" alt="Charleston Juneteenth Event Photography" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" loading="lazy">
          <div style="padding: 30px;">
            <div style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #be976d; margin-bottom: 0.75rem;">JUNE 26, 2026</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Charleston Juneteenth Event Photography</h3>
            <p style="font-size: 0.9375rem; color: #5a5a5a; margin-bottom: 1.5rem; max-width: 100%;">Black joy, food, portraits, and community at a Shades of PINCK cookout on James Island.</p>
            <a href="/blog/charleston-juneteenth-event-photography/" class="btn btn-secondary" style="width: 100%;">View the Gallery</a>
          </div>
        </div>
        
        <div class="blog-card" style="border-radius: 10px; overflow: hidden; border: 1px solid #e8e8e8; transition: transform 0.3s ease, box-shadow 0.3s ease;">
          <img src="/images/couples/charleston-anniversary-couple-downtown.webp" alt="Downtown Charleston Anniversary Photography" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; object-position: center 35%;" loading="lazy">
          <div style="padding: 30px;">
            <div style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #be976d; margin-bottom: 0.75rem;">MARCH 10, 2026</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Downtown Charleston Anniversary Photography</h3>
            <p style="font-size: 0.9375rem; color: #5a5a5a; margin-bottom: 1.5rem; max-width: 100%;">A milestone couples session through downtown Charleston with location tips, styling advice, and warm editorial portraits.</p>
            <a href="/blog/anniversary-photography-downtown-charleston/" class="btn btn-secondary" style="width: 100%;">See the Session</a>
          </div>
        </div>
        
        <div class="blog-card" style="border-radius: 10px; overflow: hidden; border: 1px solid #e8e8e8; transition: transform 0.3s ease, box-shadow 0.3s ease;">
          <img src="/images/optimized/portraits/charleston-graduation-photography-1200.webp" alt="Charleston Graduation Photography" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" loading="lazy">
          <div style="padding: 30px;">
            <div style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #be976d; margin-bottom: 0.75rem;">MARCH 19, 2026</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Charleston Graduation Photography</h3>
            <p style="font-size: 0.9375rem; color: #5a5a5a; margin-bottom: 1.5rem; max-width: 100%;">You worked too hard for bad grad photos. The best Charleston locations, what to wear, and when to book your session.</p>
            <a href="/blog/charleston-graduation-photography/" class="btn btn-secondary" style="width: 100%;">Read Charleston Graduation Guide</a>
          </div>
        </div>
      </div>
      
      <div class="text-center" style="margin-top: 40px;">
        <a href="/blog.html" class="btn btn-secondary">See All Posts</a>
      </div>
    </div>
  </section>
`;

// 4. Add FAQ Section
const faqSection = `
  <!-- FAQ -->
  <section class="faq section" style="background: #ffffff;">
    <div class="container">
      <div class="text-center" style="margin-bottom: 60px;">
        <span class="kicker">FAQ</span>
        <h2>Frequently Asked Questions</h2>
        <p style="margin: 0 auto; color: #5a5a5a; max-width: 700px;">Get answers to common questions about booking, turnaround times, service areas, and deliverables. Visit the full FAQ page for the complete list.</p>
        <a href="/FAQ.html" style="color: #be976d; font-weight: 500; margin-top: 1rem; display: inline-block;">See common questions →</a>
      </div>
      
      <div class="faq-grid" style="max-width: 900px; margin: 0 auto;">
        <div class="faq-item" style="padding: 30px; border-bottom: 1px solid #e8e8e8;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #2a2a2a;">How far in advance should I book my photography session?</h3>
          <p style="color: #5a5a5a; max-width: 100%;">For graduation and event photography, I recommend booking 2-4 weeks in advance, especially during peak seasons (April-May for spring graduation, November-December for fall graduation). Portrait sessions can often be scheduled within 1-2 weeks.</p>
        </div>
        
        <div class="faq-item" style="padding: 30px; border-bottom: 1px solid #e8e8e8;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #2a2a2a;">What happens if it rains on the day of our outdoor session?</h3>
          <p style="color: #5a5a5a; max-width: 100%;">I monitor weather forecasts closely and will reach out 24-48 hours before if rain is likely. We can reschedule at no charge, find a covered location, or embrace the weather for unique moody shots (if you're comfortable).</p>
        </div>
        
        <div class="faq-item" style="padding: 30px; border-bottom: 1px solid #e8e8e8;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #2a2a2a;">How long until I receive my photos?</h3>
          <p style="color: #5a5a5a; max-width: 100%;">All sessions are delivered within 1 week via digital gallery. Graduation sessions during peak season (April-May) may take up to 10 days. You'll receive full-resolution downloads with no watermarks.</p>
        </div>
        
        <div class="faq-item" style="padding: 30px; border-bottom: 1px solid #e8e8e8;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #2a2a2a;">Do you provide both digital files and prints?</h3>
          <p style="color: #5a5a5a; max-width: 100%;">All packages include full-resolution digital downloads. Prints are not included in base packages, but I can recommend local print labs in Charleston or DMV if you'd like physical copies.</p>
        </div>
        
        <div class="faq-item" style="padding: 30px;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #2a2a2a;">What areas around Charleston do you serve?</h3>
          <p style="color: #5a5a5a; max-width: 100%;">I serve all of Charleston County (downtown, Mount Pleasant, James Island, Sullivan's Island, Isle of Palms, Folly Beach) and the DMV area (Washington DC, Maryland, Northern Virginia). Travel within these areas is included.</p>
        </div>
      </div>
      
      <div class="text-center" style="margin-top: 40px;">
        <a href="/FAQ.html" class="btn btn-secondary">See the Full Photography FAQ</a>
      </div>
    </div>
  </section>
`;

// Insert sections after Contact Form but before Footer
const contactFormEnd = '</form>\n    </div>\n  </section>';
html = html.replace(contactFormEnd, contactFormEnd + '\n' + reviewsSection + '\n' + blogGuidesSection + '\n' + faqSection);

// Add Stats after About
const aboutEnd = '</div>\n    </div>\n  </section>\n\n  <!-- Contact Form';
html = html.replace(aboutEnd, '</div>\n    </div>\n  </section>\n' + statsSection + '\n\n  <!-- Contact Form');

fs.writeFileSync('./index.html', html, 'utf8');
console.log('✅ Added missing sections to index.html');
