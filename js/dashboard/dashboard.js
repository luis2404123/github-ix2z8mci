import { Auth } from '../auth/auth.js';
import { DashboardService } from './dashboardService.js';
import { ActivityList } from '../components/ActivityList.js';
import { Navigation } from '../components/Navigation.js';

class Dashboard {
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

      // Initialize components after user authentication
      this.activityList = new ActivityList('activity-list');
      this.navigation = new Navigation();
      
      this.initializeUI(user);
      this.initializeEventListeners();
      await this.loadDashboardData();
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      this.showError('Failed to initialize dashboard');
    }
  }

  initializeUI(user) {
    try {
      const userName = document.getElementById('user-name');
      const userEmail = document.getElementById('user-email');
      
      if (userName) {
        userName.textContent = user.user_metadata?.full_name || 'User';
      }
      if (userEmail) {
        userEmail.textContent = user.email;
      }
    } catch (error) {
      console.error('UI initialization error:', error);
    }
  }

  initializeEventListeners() {
    try {
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          try {
            const { error } = await Auth.signOut();
            if (!error) {
              window.location.href = '/Login/login.html';
            } else {
              this.showError('Failed to sign out');
            }
          } catch (error) {
            console.error('Logout error:', error);
            this.showError('Failed to sign out');
          }
        });
      }
    } catch (error) {
      console.error('Event listener initialization error:', error);
    }
  }

  async loadDashboardData() {
    try {
      const dashboardData = await DashboardService.getDashboardStats();
      this.updateDashboardStats(dashboardData);
      this.updateRecentActivity(dashboardData.recentActivity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showError('Failed to load dashboard data');
    }
  }

  updateDashboardStats(data) {
    try {
      const stats = {
        'total-documents': data.totalDocuments,
        'total-translations': data.totalTranslations,
        'active-qr-codes': data.activeQRCodes
      };

      Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
          element.classList.add('stat-updated');
          setTimeout(() => element.classList.remove('stat-updated'), 1000);
        }
      });
    } catch (error) {
      console.error('Error updating dashboard stats:', error);
    }
  }

  updateRecentActivity(activities) {
    try {
      if (this.activityList) {
        this.activityList.update(activities);
      }
    } catch (error) {
      console.error('Error updating activity list:', error);
    }
  }

  showError(message) {
    try {
      const container = document.querySelector('.main-content');
      if (!container) return;

      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;

      container.insertBefore(errorDiv, container.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    } catch (error) {
      console.error('Error showing error message:', error);
    }
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});