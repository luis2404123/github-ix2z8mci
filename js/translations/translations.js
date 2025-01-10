import { Auth } from '../auth/auth.js';
import { setupFileUploadPreview, handleFileUpload } from './uploadHandler.js';
import { TranslationService } from './translationService.js';
import { setupModalHandlers } from '../utils/modalHandler.js';

class TranslationsPage {
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

      this.initializeComponents();
      this.initializeEventListeners();
      await this.loadTranslations();
    } catch (error) {
      console.error('Error initializing translations page:', error);
    }
  }

  initializeComponents() {
    setupFileUploadPreview();
    setupModalHandlers('translation-modal', 'new-translation-btn');
  }

  initializeEventListeners() {
    // Form submission
    const form = document.getElementById('translation-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit(e);
      });
    }

    // Search and filter
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterTranslations());
    }
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.filterTranslations());
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const { error } = await Auth.signOut();
        if (!error) {
          window.location.href = '/Login/login.html';
        }
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    try {
      const fileInput = form.querySelector('#document');
      const sourceCountryInput = document.querySelector('#source-country .country-search-input');
      const targetCountryInput = document.querySelector('#target-country .country-search-input');

      if (!fileInput?.files[0]) {
        throw new Error('Please select a file to translate');
      }

      if (!sourceCountryInput?.value || !targetCountryInput?.value) {
        throw new Error('Please select both source and target languages');
      }

      const { user } = await Auth.getCurrentUser();
      const uploadResult = await handleFileUpload(fileInput.files[0], user.id);
      
      if (uploadResult.error) throw new Error(uploadResult.error);

      const result = await TranslationService.createTranslation({
        userId: user.id,
        filePath: uploadResult.path,
        fileName: uploadResult.name,
        sourceLanguage: sourceCountryInput.value,
        targetLanguage: targetCountryInput.value
      });

      if (result.error) throw new Error(result.error);

      document.getElementById('translation-modal').style.display = 'none';
      form.reset();
      await this.loadTranslations();

      // Show success message
      this.showMessage('Translation started successfully', 'success');
    } catch (error) {
      console.error('Error submitting translation:', error);
      this.showMessage(error.message, 'error');
    }
  }

  showMessage(message, type) {
    const container = document.querySelector('.translations-container');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    container.insertBefore(messageDiv, container.firstChild);
    setTimeout(() => messageDiv.remove(), 5000);
  }

  async loadTranslations() {
    try {
      const translations = await TranslationService.getTranslations();
      this.renderTranslations(translations);
    } catch (error) {
      console.error('Error loading translations:', error);
      this.showMessage('Failed to load translations', 'error');
    }
  }

  renderTranslations(translations) {
    const container = document.getElementById('translations-list');
    if (!container) return;

    container.innerHTML = translations.length ? '' : '<p>No translations found</p>';

    translations.forEach(translation => {
      const element = document.createElement('div');
      element.className = 'translation-item';
      element.innerHTML = `
        <div class="translation-info">
          <h3 class="translation-title">${translation.document_name}</h3>
          <p class="translation-meta">
            ${translation.source_language} → ${translation.target_language}
            <br>
            <small>Created: ${new Date(translation.created_at).toLocaleString()}</small>
          </p>
        </div>
        <span class="translation-status status-${translation.status.toLowerCase()}">
          ${translation.status}
        </span>
      `;
      container.appendChild(element);
    });
  }

  filterTranslations() {
    const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';
    const status = document.querySelector('.filter-select')?.value || 'all';
    const items = document.querySelectorAll('.translation-item');

    items.forEach(item => {
      const title = item.querySelector('.translation-title')?.textContent.toLowerCase() || '';
      const itemStatus = item.querySelector('.translation-status')?.textContent.toLowerCase() || '';
      const matchesSearch = title.includes(searchTerm);
      const matchesStatus = status === 'all' || itemStatus === status;

      item.style.display = matchesSearch && matchesStatus ? 'flex' : 'none';
    });
  }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TranslationsPage();
});