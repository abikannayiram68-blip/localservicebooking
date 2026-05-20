import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getAllBookings, updateBooking } from '../../services/api';

const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;
const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const fetch = () => getAllBookings().then(res => setBookings(res.data.bookings)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await updateBooking(id, { status });
      setMessage('Status updated!');
      fetch();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <Layout title="All Bookings"><div className="loading-inline"><div className="spinner"></div></div></Layout>;

  return (
    <Layout title="All Bookings">
      {message && <div className="alert alert-success">{message}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s} {s === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Customer</th><th>Service</th><th>Date</th><th>Price</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No bookings.</td></tr>
              )}
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{b.id}</td>
                  <td>
                    <div style={{ color: 'var(--text)', fontWeight: 600 }}>{b.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user_email}</div>
                  </td>
                  <td>{b.service_name}</td>
                  <td>{new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>₹{b.price}</td>
                  <td>{statusBadge(b.status)}</td>
                  <td>
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <select
                        defaultValue={b.status}
                        disabled={updating === b.id}
                        onChange={e => handleStatusChange(b.id, e.target.value)}
                        style={{
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
