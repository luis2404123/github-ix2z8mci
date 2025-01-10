import { Auth } from '../auth/auth.js';
import { SettingsService } from './settingsService.js';

class SettingsPage {
  constructor() {
    this.init();
  }

  async init() {
    const { user, error } = await Auth.getCurrentUser();
    if (error || !user) {
      window.location.href = '/Login/login.html';
      return;
    }

    this.initializeUI(user);
    this.initializeEventListeners();
  }

  initializeUI(user) {
    // Set user information
    document.getElementById('full-name').value = user.user_metadata.full_name || '';
    document.getElementById('email').value = user.email;
  }

  initializeEventListeners() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.updateProfile(profileForm);
    });

    // Password form
    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.updatePassword(passwordForm);
    });

    // Notification form
    const notificationForm = document.getElementById('notification-form');
    notificationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.updateNotifications(notificationForm);
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
      const { error } = await Auth.signOut();
      if (!error) {
        window.location.href = '/Login/login.html';
      }
    });
  }

  async updateProfile(form) {
    const fullName = form.querySelector('#full-name').value;
    try {
      const result = await SettingsService.updateProfile({ full_name: fullName });
      if (result.error) {
        throw new Error(result.error);
      }
      this.showMessage(form, 'Profile updated successfully!', 'success');
    } catch (error) {
      this.showMessage(form, error.message, 'error');
    }
  }

  async updatePassword(form) {
    const currentPassword = form.querySelector('#current-password').value;
    const newPassword = form.querySelector('#new-password').value;
    const confirmPassword = form.querySelector('#confirm-password').value;

    if (newPassword !== confirmPassword) {
      this.showMessage(form, 'New passwords do not match', 'error');
      return;
    }

    try {
      const result = await SettingsService.updatePassword(currentPassword, newPassword);
      if (result.error) {
        throw new Error(result.error);
      }
      form.reset();
      this.showMessage(form, 'Password updated successfully!', 'success');
    } catch (error) {
      this.showMessage(form, error.message, 'error');
    }
  }

  async updateNotifications(form) {
    const settings = {
      email_notifications: form.querySelector('#email-notifications').checked,
      translation_updates: form.querySelector('#translation-updates').checked,
      qr_code_alerts: form.querySelector('#qr-code-alerts').checked
    };

    try {
      const result = await SettingsService.updateNotificationSettings(settings);
      if (result.error) {
        throw new Error(result.error);
      }
      this.showMessage(form, 'Notification preferences updated!', 'success');
    } catch (error) {
      this.showMessage(form, error.message, 'error');
    }
  }

  showMessage(form, message, type) {
    let messageDiv = form.querySelector('.message');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      form.insertBefore(messageDiv, form.firstChild);
    }

    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SettingsPage();
});