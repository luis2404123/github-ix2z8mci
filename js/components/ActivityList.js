import { formatTimeAgo } from '../utils/dateUtils.js';

export class ActivityList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  getActivityIcon(type) {
    const icons = {
      created: { icon: 'note_add', color: '#4caf50' },
      completed: { icon: 'task_alt', color: '#2196f3' },
      failed: { icon: 'error', color: '#f44336' },
      processing: { icon: 'sync', color: '#ff9800' },
      pending: { icon: 'hourglass_empty', color: '#9c27b0' }
    };
    return icons[type] || { icon: 'info', color: '#757575' };
  }

  getActivityType(description) {
    const types = {
      completed: 'completed',
      failed: 'failed',
      processing: 'processing',
      pending: 'pending'
    };
    return Object.keys(types).find(type => description.toLowerCase().includes(type)) || 'created';
  }

  extractLanguages(description) {
    const match = description.match(/\(([^)]+)\)/);
    if (match) {
      const [source, target] = match[1].split('→').map(lang => lang.trim());
      return { source, target };
    }
    return { source: 'Unknown', target: 'Unknown' };
  }

  renderActivity(activity, index) {
    const type = this.getActivityType(activity.description);
    const { icon, color } = this.getActivityIcon(type);
    const { source, target } = this.extractLanguages(activity.description);
    const delay = index * 100;

    const element = document.createElement('div');
    element.className = `activity-item ${type}`;
    element.style.setProperty('--animation-delay', `${delay}ms`);

    element.innerHTML = `
      <div class="activity-icon">
        <span class="material-symbols-outlined">${icon}</span>
      </div>
      <div class="activity-content">
        <div class="activity-title">${activity.description}</div>
        <div class="activity-meta">
          <div class="time-badge">
            <span class="material-symbols-outlined">schedule</span>
            ${formatTimeAgo(activity.created_at)}
          </div>
          <div class="language-pills">
            <span class="language-pill">${source}</span>
            <span class="material-symbols-outlined">arrow_forward</span>
            <span class="language-pill">${target}</span>
          </div>
        </div>
      </div>
      <div class="activity-actions">
        <button class="action-btn" title="View Details">
          <span class="material-symbols-outlined">visibility</span>
        </button>
      </div>
    `;

    this.observer.observe(element);
    return element;
  }

  update(activities) {
    if (!this.container) return;

    if (!activities.length) {
      this.container.innerHTML = `
        <div class="no-activity">
          <span class="material-symbols-outlined">history</span>
          <h3>No Recent Activity</h3>
          <p>Start by creating a new translation</p>
          <button class="primary-btn">
            <span class="material-symbols-outlined">add</span>
            New Translation
          </button>
        </div>
      `;
      return;
    }

    this.container.innerHTML = '';
    activities.forEach((activity, index) => {
      this.container.appendChild(this.renderActivity(activity, index));
    });
  }
}