document.addEventListener('DOMContentLoaded', () => {
  // Password Toggle
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', () => {
    const type =
      passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle eye icon using Material Symbols
    togglePassword.innerHTML = type === 'password'
      ? '<span class="material-symbols-outlined">visibility</span>'
      : '<span class="material-symbols-outlined">visibility_off</span>';
  });

  // Form Submission
  const form = document.getElementById('login-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (email === '' || password === '') {
      displayMessage('Please fill in both fields.', 'error');
      return;
    }

    // Simulating successful login
    displayMessage('Login successful!', 'success');
  });

  function displayMessage(message, type) {
    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      form.insertBefore(messageDiv, form.firstChild);
    }

    messageDiv.textContent = message;
    messageDiv.classList.remove('error', 'success');
    messageDiv.classList.add(type);

    // Automatically remove the message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 15000);
  }

  // Slideshow
  let slideIndex = 0;
  const slides = document.querySelectorAll('.mySlides');
  const dots = document.querySelectorAll('.dot');

  showSlides();

  function showSlides() {
    slides.forEach((slide) => (slide.style.display = 'none'));

    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = 'block';

    dots.forEach((dot) => dot.classList.remove('active'));
    dots[slideIndex - 1].classList.add('active');

    setTimeout(showSlides, 15000); // Change slide every 5 seconds
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      slides.forEach((slide) => (slide.style.display = 'none'));
      dots.forEach((dot) => dot.classList.remove('active'));

      slides[index].style.display = 'block';
      dots[index].classList.add('active');

      slideIndex = index + 1;
    });
  });
});