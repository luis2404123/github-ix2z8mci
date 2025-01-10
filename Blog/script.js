document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const searchInput = document.querySelector('.search-input');
  const blogCards = document.querySelectorAll('.blog-card');
  const form = document.querySelector('.cta-form'); // Define form only once

  // Navbar scroll effect
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
  }

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('open');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      const headerOffset = navbar ? navbar.offsetHeight : 0;
      const elementPosition = target ? target.offsetTop : 0;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });

  // Form validation
  if (form) {
    form.addEventListener('submit', (e) => {
      const name = form.querySelector('input[placeholder="Your Name"]').value.trim();
      const email = form.querySelector('input[placeholder="Your Email"]').value.trim();
      const company = form.querySelector('input[placeholder="Company Name"]').value.trim();
      const message = form.querySelector('textarea[placeholder="Message"]').value.trim();

      if (!name || !email || !company || !message) {
        e.preventDefault();
        alert("Please fill out all fields before submitting the form.");
      }
    });
  }

  // Blog search functionality
  if (searchInput && blogCards.length > 0) {
    const filterBlogs = (query) => {
      blogCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
      });
    };

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      filterBlogs(query);
    });
  }
});
