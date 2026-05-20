import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getAdminDashboard } from '../../services/api';

const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Admin Overview"><div className="loading-inline"><div className="spinner"></div></div></Layout>;

  return (
    <Layout title="Admin Overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{data?.stats?.totalUsers ?? 0}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{data?.stats?.totalBookings ?? 0}</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">👷</div>
          <div className="stat-label">Active Providers</div>
          <div className="stat-value">{data?.stats?.activeProviders ?? 0}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Pending Bookings</div>
          <div className="stat-value">{data?.stats?.pendingBookings ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Bookings</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Customer</th><th>Service</th><th>Date</th><th>Price</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data?.recentBookings?.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No bookings yet.</td></tr>
              )}
              {data?.recentBookings?.map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{b.id}</td>
                  <td style={{ color: 'var(--text)', fontWeight: 600 }}>{b.user_name}</td>
                  <td>{b.service_name}</td>
                  <td>{new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>₹{b.price}</td>
                  <td>{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
