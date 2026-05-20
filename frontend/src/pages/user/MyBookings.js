import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getBookings, updateBooking } from '../../services/api';

const statusBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;
const canCancel = (booking) => ['pending', 'confirmed'].includes(booking.status);

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const showMessage = useCallback((text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => setMessage(''), 3000);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      setBookings(Array.isArray(res.data?.bookings) ? res.data.bookings : []);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Unable to load your bookings.', 'error');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (booking) => {
    if (!canCancel(booking)) {
      showMessage('Only pending or confirmed bookings can be cancelled.', 'error');
      return;
    }

    if (!window.confirm('Cancel this booking?')) return;

    setCancelling(booking.id);
    try {
      await updateBooking(booking.id, { status: 'cancelled' });
      showMessage('Booking cancelled successfully.');
      await fetchBookings();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to cancel booking.', 'error');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <Layout title="My Bookings">
        <div className="loading-inline"><div className="spinner"></div></div>
      </Layout>
    );
  }

  return (
    <Layout title="My Bookings">
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">No bookings</div>
          <p>
            You have not made any bookings yet.{' '}
            <Link to="/services" style={{ color: 'var(--accent-light)' }}>Browse services</Link>.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Provider</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ color: 'var(--text-muted)' }}>#{booking.id}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>{booking.service_name}</td>
                    <td>{new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>{booking.provider_name || <span style={{ color: 'var(--text-muted)' }}>Assigning...</span>}</td>
                    <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>Rs. {booking.price}</td>
                    <td>{statusBadge(booking.status)}</td>
                    <td>
                      {canCancel(booking) ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(booking)}
                          disabled={cancelling === booking.id}
                        >
                          {cancelling === booking.id ? 'cancelling ....' : 'Cancel'}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
