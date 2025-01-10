import { Auth } from '../auth/auth.js';
import { Navigation } from '../components/Navigation.js';
import { SettingsService } from './settingsService.js';

class ProfileSettings {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const { user, error } = await Auth.getCurrentUser();
      if (error || !user) {
        window.location.href = '/Login/login.html';
        return;
      }

      this.navigation = new Navigation();
      this.initializeUI(user);
      this.initializeEventListeners();
    } catch (error) {
      console.error('Profile settings initialization error:', error);
    }
  }

  initializeUI(user) {
    // Set form values from user data
    document.getElementById('full-name').value = user.user_metadata?.full_name || '';
    document.getElementById('job-title').value = user.user_metadata?.job_title || '';
    document.getElementById('company').value = user.user_metadata?.company || '';
    document.getElementById('bio').value = user.user_metadata?.bio || '';

    // Set avatar if exists
    if (user.user_metadata?.avatar_url) {
      document.getElementById('avatar-image').src = user.user_metadata.avatar_url;
    }
  }

  initializeEventListeners() {
    // Avatar upload
    const avatarUpload = document.getElementById('avatar-upload');
    avatarUpload?.addEventListener('change', (e) => this.handleAvatarUpload(e));

    // Form submission
    const form = document.getElementById('profile-form');
    form?.addEventListener('submit', (e) => this.handleSubmit(e));

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn?.addEventListener('click', async () => {
      const { error } = await Auth.signOut();
      if (!error) {
        window.location.href = '/Login/login.html';
      }
    });
  }

  async handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await SettingsService.uploadAvatar(file);
      if (result.error) throw result.error;
      
      document.getElementById('avatar-image').src = result.url;
    } catch (error) {
      console.error('Avatar upload error:', error);
      // Show error message to user
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const formData = {
      full_name: document.getElementById('full-name').value,
      job_title: document.getElementById('job-title').value,
      company: document.getElementById('company').value,
      bio: document.getElementById('bio').value
    };

    try {
      const result = await SettingsService.updateProfile(formData);
      if (result.error) throw result.error;
      
      // Show success message
      this.showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      this.showMessage('Failed to update profile', 'error');
    }
  }

  showMessage(message, type) {
    // Implement message display logic
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProfileSettings();
});