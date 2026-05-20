import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const userLinks = [
  { to: '/dashboard', icon: 'DB', label: 'Dashboard' },
  { to: '/services', icon: 'SV', label: 'Services' },
  { to: '/my-bookings', icon: 'BK', label: 'My Bookings' },
];

const adminLinks = [
  { to: '/admin', icon: 'OV', label: 'Overview' },
  { to: '/admin/bookings', icon: 'BK', label: 'All Bookings' },
  { to: '/admin/services', icon: 'SV', label: 'Manage Services' },
  { to: '/admin/providers', icon: 'PR', label: 'Providers' },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const links = user?.role === 'admin' ? adminLinks : userLinks;
  const initials = user?.name ? user.name.split(' ').map((name) => name[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>ServiceBook</h2>
        <p>Home Services Platform</p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">{user?.role === 'admin' ? 'Admin Panel' : 'Menu'}</div>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/admin' || link.to === '/dashboard'}>
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
        <div className="sidebar-section-label" style={{ marginTop: 12 }}>Account</div>
        <button onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <span className="nav-icon"></span>
          LOGOUT
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-chip-name">{user?.name}</div>
            <div className="user-chip-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
