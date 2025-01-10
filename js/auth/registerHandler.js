import { Auth } from './auth.js';
import { showMessage } from '../utils/messageHandler.js';

// Handle registration form submission
export function initializeRegisterForm() {
  const registerForm = document.getElementById('register-form');
  const messageDiv = document.querySelector('.message');

  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      showMessage(messageDiv, 'Passwords do not match', 'error');
      return;
    }

    try {
      const { data, error } = await Auth.signUp(email, password, fullName);
      
      if (error) {
        if (error.includes('already registered')) {
          showMessage(messageDiv, 'This email is already registered. Please log in instead.', 'error');
        } else {
          showMessage(messageDiv, error, 'error');
        }
        return;
      }

      showMessage(messageDiv, 'Registration successful! Redirecting to login...', 'success');
      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = '/Login/login.html';
      }, 2000);
    } catch (error) {
      showMessage(messageDiv, error.message, 'error');
    }
  });

  // Handle password visibility toggles
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.innerHTML = type === 'password'
        ? '<span class="material-symbols-outlined">visibility</span>'
        : '<span class="material-symbols-outlined">visibility_off</span>';
    });
  }

  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', () => {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      toggleConfirmPassword.innerHTML = type === 'password'
        ? '<span class="material-symbols-outlined">visibility</span>'
        : '<span class="material-symbols-outlined">visibility_off</span>';
    });
  }
}

// Initialize the form when the script loads
initializeRegisterForm();