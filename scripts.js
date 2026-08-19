// ========================================
// VISUALS BY JOSHUA - EDITORIAL INTERACTIONS
// ========================================

// Rotating Hero Background
(function() {
  const heroImages = document.querySelectorAll('.hero-image');
  if (heroImages.length > 0) {
    let currentIndex = 0;
    const rotateInterval = 8000; // 8 seconds

    function rotateHero() {
      heroImages[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % heroImages.length;
      heroImages[currentIndex].classList.add('active');
    }

    setInterval(rotateHero, rotateInterval);
  }
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Form validation enhancement
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Please enter a valid email address.');
      return false;
    }

    // Validate graduation package if graduation is selected
    const service = document.getElementById('service');
    const graduationPackage = document.getElementById('graduation-package');
    if (service && graduationPackage && service.value === 'Graduation Photography' && !graduationPackage.value) {
      e.preventDefault();
      alert('Please select a graduation package.');
      return false;
    }
  });
}

// Show/hide graduation package selector
const serviceSelect = document.getElementById('service');
const graduationPackageGroup = document.getElementById('graduation-package-group');
const graduationPackageSelect = document.getElementById('graduation-package');

if (serviceSelect && graduationPackageGroup) {
  serviceSelect.addEventListener('change', function() {
    if (this.value === 'Graduation Photography') {
      graduationPackageGroup.style.display = 'grid';
      graduationPackageSelect.setAttribute('required', 'required');
    } else {
      graduationPackageGroup.style.display = 'none';
      graduationPackageSelect.removeAttribute('required');
      graduationPackageSelect.value = '';
    }
  });
}

// Mobile nav toggle
document.querySelectorAll('.nav-toggle').forEach(function(btn) {
  const menu = document.getElementById(btn.getAttribute('aria-controls'));
  if (!menu) return;

  btn.addEventListener('click', function() {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
});

// Pre-fill service/package from "Book Now" buttons
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const service = this.getAttribute('data-service');

    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Pre-fill service dropdown
    setTimeout(() => {
      if (service.includes('Graduation')) {
        serviceSelect.value = 'Graduation Photography';
        graduationPackageGroup.style.display = 'grid';
        graduationPackageSelect.setAttribute('required', 'required');

        // Extract package type from service string
        if (service.includes('Bronze')) {
          graduationPackageSelect.value = 'Bronze - $150';
        } else if (service.includes('Silver')) {
          graduationPackageSelect.value = 'Silver - $250';
        } else if (service.includes('Gold')) {
          graduationPackageSelect.value = 'Gold - $400';
        }
      } else {
        serviceSelect.value = service;
      }
    }, 500);
  });
});
