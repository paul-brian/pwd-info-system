import { useState, useEffect } from 'react';
import AdminSettings from "./admin/AdminSettings"; // existing UI
import UserSettings from '../settings/UserSettings';
import StaffSettings from './StaffSettings';
import { ROLES } from '../Auth/roles';

const PagesSettings = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole =
      localStorage.getItem('userRole') ||
      sessionStorage.getItem('userRole');
    setRole(userRole);
  }, []);

  if (role === ROLES.USER) return <UserSettings />;
  if (role === ROLES.STAFF) return <StaffSettings />;
  return <AdminSettings />;
};

export default PagesSettings;