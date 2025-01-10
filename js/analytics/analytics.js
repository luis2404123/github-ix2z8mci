import { Auth } from '../auth/auth.js';
import { Navigation } from '../components/Navigation.js';
import { AnalyticsService } from './analyticsService.js';

class Analytics {
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
      this.initializeEventListeners();
      await this.initializeCharts();
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }

  initializeEventListeners() {
    // Period selector buttons
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(button => {
      button.addEventListener('click', () => {
        periodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.updateCharts(button.dataset.period);
      });
    });

    // Logout button
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

  async initializeCharts() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    this.activityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Translations',
          data: [],
          borderColor: '#ff6b6b',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(255, 107, 107, 0.1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f0f0f0'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    // Load initial data
    await this.updateCharts(30);
  }

  async updateCharts(days) {
    try {
      const data = await AnalyticsService.getActivityData(days);
      
      this.activityChart.data.labels = data.labels;
      this.activityChart.data.datasets[0].data = data.values;
      this.activityChart.update();
    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Analytics();
});