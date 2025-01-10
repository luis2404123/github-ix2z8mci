document.addEventListener('DOMContentLoaded', () => {
  // Selecting the password, confirm password, and toggle elements
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const passwordRequirements = document.getElementById('password-requirements');
  const successMessage = document.getElementById('password-success-message');

  // Event listeners for input fields and visibility toggle buttons
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validatePassword);
  togglePassword.addEventListener('click', () => toggleVisibility(passwordInput, togglePassword));
  toggleConfirmPassword.addEventListener('click', () => toggleVisibility(confirmPasswordInput, toggleConfirmPassword));

  // Validation function that checks the various requirements
  function validatePassword() {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    let requirementsFulfilled = true;

    // Length Check: At least 8 characters
    requirementsFulfilled &= toggleValidation('length-check', password.length >= 8);

    // Number Check: At least one number
    requirementsFulfilled &= toggleValidation('number-check', /\d/.test(password));

    // Lowercase Check: At least one lowercase letter
    requirementsFulfilled &= toggleValidation('lowercase-check', /[a-z]/.test(password));

    // Uppercase Check: At least one uppercase letter
    requirementsFulfilled &= toggleValidation('uppercase-check', /[A-Z]/.test(password));

    // Symbol Check: At least one special character
    requirementsFulfilled &= toggleValidation('symbol-check', /[!@#\$%\^\&*\)\(+=._-]/.test(password));

    // Match Check: Password and Confirm Password must match
    requirementsFulfilled &= toggleValidation('match-check', password === confirmPassword && password.length > 0);

    // If all requirements are met, hide the requirements and show success message
    if (requirementsFulfilled) {
      passwordRequirements.style.display = 'none';
      successMessage.style.display = 'block';
    } else {
      passwordRequirements.style.display = 'block';
      successMessage.style.display = 'none';
    }
  }

  // Function to toggle the checkmarks and color for each requirement
  function toggleValidation(id, isValid) {
    const element = document.getElementById(id);
    const icon = element.querySelector('.icon');
    
    if (isValid) {
      element.classList.add('valid'); // Turn green
      icon.textContent = '✔️'; // Show checkmark
      return true;
    } else {
      element.classList.remove('valid'); // Turn red
      icon.textContent = '❌'; // Show cross
      return false;
    }
  }

  // Function to toggle password visibility for both password fields
  function toggleVisibility(input, toggleButton) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    toggleButton.innerHTML = type === 'password'
      ? '<span class="material-symbols-outlined">visibility</span>'
      : '<span class="material-symbols-outlined">visibility_off</span>';
  }

  // Slideshow Logic
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

    setTimeout(showSlides, 5000); // Change slide every 5 seconds
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
