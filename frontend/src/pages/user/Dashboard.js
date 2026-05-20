import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getUserDashboard } from '../../services/api';

const statusBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Unable to load dashboard data. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="loading-inline"><div className="spinner"></div></div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">TB</div>
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{data?.stats?.total ?? 0}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">UP</div>
          <div className="stat-label">Upcoming</div>
          <div className="stat-value">{data?.stats?.upcoming ?? 0}</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">OK</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{data?.stats?.completed ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Bookings</span>
        </div>
        {!data?.recentBookings?.length ? (
          <div className="empty-state">
            <div className="empty-icon">No bookings</div>
            <p>No bookings yet. <a href="/services" style={{ color: 'var(--accent-light)' }}>Browse services</a> to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Service</th><th>Date</th><th>Price</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>{booking.service_name}</td>
                    <td>{new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>Rs. {booking.price}</td>
                    <td>{statusBadge(booking.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
} 
