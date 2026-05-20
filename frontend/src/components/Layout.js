import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../utils/AuthContext';

export default function Layout({ children, title }) {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>{title}</h1>
          <div className="topbar-right">
            <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              Welcome, <strong style={{ color: 'var(--text)' }}>{user?.name}</strong>
            </span>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
