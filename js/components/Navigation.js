export class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.initializeNavGroups();
    this.setActiveNavItem();
    this.maintainNavigationState();
  }

  initializeNavGroups() {
    const navGroups = document.querySelectorAll('.nav-group');
    
    navGroups.forEach(group => {
      const header = group.querySelector('.nav-group-header');
      const items = group.querySelector('.nav-group-items');
      
      // Add click handler
      header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Store navigation state
        const groupId = header.textContent.trim().toLowerCase();
        const isExpanded = !group.classList.contains('expanded');
        this.storeNavigationState(groupId, isExpanded);
        
        // Toggle current group
        group.classList.toggle('expanded');
      });

      // Check if group contains active item or was previously expanded
      const hasActiveItem = items.querySelector('.nav-subitem.active');
      const groupId = header.textContent.trim().toLowerCase();
      const wasExpanded = this.getNavigationState(groupId);
      
      if (hasActiveItem || wasExpanded) {
        group.classList.add('expanded');
      }
    });
  }

  setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-subitem');
    
    navItems.forEach(item => {
      const itemPath = item.getAttribute('href');
      if (itemPath) {
        // Check if current path ends with the item path
        const isActive = currentPath.endsWith(itemPath);
        item.classList.toggle('active', isActive);
        
        if (isActive) {
          const group = item.closest('.nav-group');
          if (group) {
            group.classList.add('expanded');
            // Store navigation state
            const groupId = group.querySelector('.nav-group-header').textContent.trim().toLowerCase();
            this.storeNavigationState(groupId, true);
          }
        }
      }
    });
  }

  maintainNavigationState() {
    const navGroups = document.querySelectorAll('.nav-group');
    
    navGroups.forEach(group => {
      const header = group.querySelector('.nav-group-header');
      const groupId = header.textContent.trim().toLowerCase();
      const isExpanded = this.getNavigationState(groupId);
      
      if (isExpanded) {
        group.classList.add('expanded');
      }
    });
  }

  storeNavigationState(groupId, isExpanded) {
    try {
      const navState = JSON.parse(sessionStorage.getItem('navState') || '{}');
      navState[groupId] = isExpanded;
      sessionStorage.setItem('navState', JSON.stringify(navState));
    } catch (error) {
      console.error('Error storing navigation state:', error);
    }
  }

  getNavigationState(groupId) {
    try {
      const navState = JSON.parse(sessionStorage.getItem('navState') || '{}');
      return navState[groupId] || false;
    } catch (error) {
      console.error('Error getting navigation state:', error);
      return false;
    }
  }
}