import { Auth } from '../auth/auth.js';
import { translate } from '../services/translationProvider.js';

export class TextTranslation {
  constructor(options) {
    this.sourceSelector = options.sourceSelector;
    this.targetSelector = options.targetSelector;
    this.maxChars = 5000;
    this.translationTimeout = null;
    this.init();
  }

  async init() {
    try {
      const { user, error } = await Auth.getCurrentUser();
      if (error || !user) {
        window.location.href = '/Login/login.html';
        return;
      }

      this.initializeElements();
      this.initializeEventListeners();
    } catch (error) {
      console.error('Text translation initialization error:', error);
      this.showError('Failed to initialize translation system');
    }
  }

  initializeElements() {
    this.sourceText = document.getElementById('source-text');
    this.targetText = document.getElementById('target-text');
    this.clearBtn = document.getElementById('clear-btn');
    this.copyBtn = document.getElementById('copy-btn');
    this.swapBtn = document.getElementById('swap-btn');
    this.currentChars = document.getElementById('current-chars');
    this.errorMessage = document.getElementById('error-message');
  }

  initializeEventListeners() {
    // Source text input
    this.sourceText.addEventListener('input', () => {
      this.updateCharCount();
      this.scheduleTranslation();
    });

    // Clear button
    this.clearBtn.addEventListener('click', () => {
      this.sourceText.value = '';
      this.targetText.value = '';
      this.updateCharCount();
    });

    // Copy button
    this.copyBtn.addEventListener('click', () => this.copyTranslation());

    // Swap languages button
    this.swapBtn.addEventListener('click', () => this.swapLanguages());
  }

  updateCharCount() {
    const count = this.sourceText.value.length;
    this.currentChars.textContent = count;
    
    // Visual feedback as limit approaches
    if (count > this.maxChars * 0.9) {
      this.currentChars.style.color = '#d32f2f';
    } else {
      this.currentChars.style.color = '#666';
    }
  }

  scheduleTranslation() {
    clearTimeout(this.translationTimeout);
    this.translationTimeout = setTimeout(() => this.translate(), 500);
  }

  async translate() {
    const sourceText = this.sourceText.value.trim();
    const sourceLanguage = this.sourceSelector.getValue()?.code;
    const targetLanguage = this.targetSelector.getValue()?.code;

    if (!sourceText || !sourceLanguage || !targetLanguage) return;

    try {
      const { translatedText, error } = await translate(
        sourceText,
        sourceLanguage,
        targetLanguage
      );

      if (error) throw new Error(error);

      this.targetText.value = translatedText;
      this.hideError();
    } catch (error) {
      console.error('Translation error:', error);
      this.showError('Translation failed. Please try again.');
    }
  }

  async copyTranslation() {
    try {
      await navigator.clipboard.writeText(this.targetText.value);
      this.copyBtn.querySelector('.material-symbols-outlined').textContent = 'check';
      setTimeout(() => {
        this.copyBtn.querySelector('.material-symbols-outlined').textContent = 'content_copy';
      }, 2000);
    } catch (error) {
      console.error('Copy error:', error);
      this.showError('Failed to copy translation');
    }
  }

  swapLanguages() {
    const sourceCountry = this.sourceSelector.getValue();
    const targetCountry = this.targetSelector.getValue();
    
    if (sourceCountry && targetCountry) {
      this.sourceSelector.setValue(targetCountry);
      this.targetSelector.setValue(sourceCountry);
      
      // Swap text content
      const tempText = this.sourceText.value;
      this.sourceText.value = this.targetText.value;
      this.targetText.value = tempText;
      
      this.updateCharCount();
    }
  }

  handleSourceLanguageChange(country) {
    if (country) this.scheduleTranslation();
  }

  handleTargetLanguageChange(country) {
    if (country) this.scheduleTranslation();
  }

  showError(message) {
    this.errorMessage.innerHTML = `
      <span class="material-symbols-outlined">error</span>
      ${message}
    `;
    this.errorMessage.style.display = 'flex';
  }

  hideError() {
    this.errorMessage.style.display = 'none';
  }
}