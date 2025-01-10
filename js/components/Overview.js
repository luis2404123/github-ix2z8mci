import { DashboardService } from '../dashboard/dashboardService.js';

export class Overview {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.loadOverviewData();
    } catch (error) {
      console.error('Overview initialization error:', error);
    }
  }

  async loadOverviewData() {
    try {
      const data = await DashboardService.getDashboardStats();
      this.updateMetrics(data);
      this.updateActivityList(data.recentActivity);
    } catch (error) {
      console.error('Error loading overview data:', error);
    }
  }

  updateMetrics(data) {
    const metrics = {
      'total-documents': data.totalDocuments,
      'total-translations': data.totalTranslations,
      'active-qr-codes': data.activeQRCodes
    };

    Object.entries(metrics).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
        element.classList.add('metric-updated');
        setTimeout(() => element.classList.remove('metric-updated'), 1000);
      }
    });
  }

  updateActivityList(activities) {
    const container = document.getElementById('activity-list');
    if (!container) return;

    if (!activities.length) {
      container.innerHTML = `
        <div class="no-activity">
          <span class="material-symbols-outlined">history</span>
          <h3>No Recent Activity</h3>
          <p>Start by creating a new translation</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activities.map(activity => this.renderActivityItem(activity)).join('');
  }

  renderActivityItem(activity) {
    const timeAgo = this.formatTimeAgo(new Date(activity.created_at));
    return `
      <div class="activity-item">
        <div class="activity-icon">
          <span class="material-symbols-outlined">history</span>
        </div>
        <div class="activity-content">
          <div class="activity-title">${activity.description}</div>
          <div class="activity-meta">${timeAgo}</div>
        </div>
      </div>
    `;
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}