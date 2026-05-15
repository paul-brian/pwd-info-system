import { ROLES } from '../pages/Auth/roles';

export const menuItems = [
  { name: 'Dashboard', path: '/Pagesdashboard', icon: 'dashboard', roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.USER] },
  { name: 'Profile', path: '/PagesProfiling', icon: 'person', roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.USER] },
  { name: 'Assistance History', path: '/PagesAssistance', icon: 'volunteer_activism', roles: [ROLES.USER] },
  { name: 'Health Status', path: '/PagesHealthStatus', icon: 'health_and_safety', roles: [ROLES.USER]},
  { name: 'Inventory & Donation', path: '/PagesInventory', icon: 'inventory_2', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { name: 'Health Monitoring', path: '/PagesHealthRecords', icon: 'medical_services', roles: [ROLES.ADMIN, ROLES.STAFF] },
  { name: 'SMS Notifications', path: '/PagesSms', icon: 'sms', roles: [ROLES.ADMIN] },
  { name: 'Announcements', path: '/PagesAnnouncements', icon: 'campaign', roles: [ROLES.USER] },
  { name: 'Event Attendance', path: '/PagesEvents', icon: 'event_available', roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.USER] },
  { name: 'Settings', path: '/PagesSettings', icon: 'settings', roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.USER] },

];
