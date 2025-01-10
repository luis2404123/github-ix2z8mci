import { Auth } from './auth.js';
import { showMessage } from '../utils/messageHandler.js';

// Handle login form submission
export function initializeLoginForm() {
  const loginForm = document.getElementById('login-form');
  const messageDiv = document.querySelector('.message');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const { data, error } = await Auth.signIn(email, password);
      
      if (error) {
        showMessage(messageDiv, error, 'error');
        return;
      }

      showMessage(messageDiv, 'Login successful!', 'success');
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } catch (error) {
      showMessage(messageDiv, error.message, 'error');
    }
  });

  // Handle password visibility toggle
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.innerHTML = type === 'password'
        ? '<span class="material-symbols-outlined">visibility</span>'
        : '<span class="material-symbols-outlined">visibility_off</span>';
    });
  }
}

// Initialize the form when the script loads
initializeLoginForm();