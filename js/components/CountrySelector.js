import { countries } from '../data/countries.js';

export class CountrySelector {
  constructor(elementId, options = {}) {
    this.container = document.getElementById(elementId);
    this.options = {
      placeholder: options.placeholder || 'Search countries...',
      onChange: options.onChange || (() => {}),
      value: options.value || ''
    };
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="country-selector" role="combobox" aria-expanded="false" aria-haspopup="listbox">
        <div class="country-search">
          <input
            type="text"
            class="country-search-input"
            placeholder="${this.options.placeholder}"
            aria-label="Search countries"
            autocomplete="off"
          />
          <button type="button" class="country-clear-btn" aria-label="Clear selection">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <ul class="country-list" role="listbox" aria-label="Countries">
          ${this.renderCountries(countries)}
        </ul>
      </div>
    `;

    this.input = this.container.querySelector('.country-search-input');
    this.list = this.container.querySelector('.country-list');
    this.clearBtn = this.container.querySelector('.country-clear-btn');
  }

  renderCountries(countries) {
    return countries.map(country => `
      <li 
        class="country-item" 
        role="option" 
        data-code="${country.code}"
        aria-selected="false"
      >
        <img 
          src="https://flagcdn.com/24x18/${country.code.toLowerCase()}.png"
          srcset="https://flagcdn.com/48x36/${country.code.toLowerCase()}.png 2x"
          alt="${country.name} flag"
          width="24"
          height="18"
        />
        <span class="country-name">${country.name}</span>
        <span class="country-native-name">${country.nativeName}</span>
      </li>
    `).join('');
  }

  attachEventListeners() {
    // Search input
    this.input.addEventListener('input', () => {
      const query = this.input.value.toLowerCase();
      this.filterCountries(query);
    });

    // Country selection
    this.list.addEventListener('click', (e) => {
      const item = e.target.closest('.country-item');
      if (item) {
        this.selectCountry(item.dataset.code);
      }
    });

    // Clear selection
    this.clearBtn.addEventListener('click', () => {
      this.clearSelection();
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigateList('next');
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateList('prev');
          break;
        case 'Enter':
          e.preventDefault();
          const focused = this.list.querySelector('.country-item:focus');
          if (focused) {
            this.selectCountry(focused.dataset.code);
          }
          break;
        case 'Escape':
          this.input.blur();
          this.list.style.display = 'none';
          break;
      }
    });

    // Handle focus
    this.input.addEventListener('focus', () => {
      this.list.style.display = 'block';
      this.container.setAttribute('aria-expanded', 'true');
    });

    // Handle click outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.list.style.display = 'none';
        this.container.setAttribute('aria-expanded', 'false');
      }
    });
  }

  filterCountries(query) {
    const items = this.list.querySelectorAll('.country-item');
    let hasVisible = false;

    items.forEach(item => {
      const name = item.querySelector('.country-name').textContent.toLowerCase();
      const nativeName = item.querySelector('.country-native-name').textContent.toLowerCase();
      const isMatch = name.includes(query) || nativeName.includes(query);
      
      item.style.display = isMatch ? 'flex' : 'none';
      if (isMatch) hasVisible = true;
    });

    this.list.style.display = hasVisible ? 'block' : 'none';
  }

  selectCountry(code) {
    const country = countries.find(c => c.code === code);
    if (!country) return;

    this.input.value = country.name;
    this.list.style.display = 'none';
    this.container.setAttribute('aria-expanded', 'false');
    
    const items = this.list.querySelectorAll('.country-item');
    items.forEach(item => {
      item.setAttribute('aria-selected', item.dataset.code === code);
    });

    this.options.onChange(country);
  }

  clearSelection() {
    this.input.value = '';
    this.input.focus();
    this.filterCountries('');
    this.options.onChange(null);
  }

  navigateList(direction) {
    const items = Array.from(this.list.querySelectorAll('.country-item:not([style*="display: none"])'));
    const focused = this.list.querySelector('.country-item:focus');
    let index = items.indexOf(focused);

    if (direction === 'next') {
      index = index < items.length - 1 ? index + 1 : 0;
    } else {
      index = index > 0 ? index - 1 : items.length - 1;
    }

    items[index]?.focus();
  }
}