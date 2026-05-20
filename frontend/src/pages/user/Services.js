import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getServices, createBooking } from '../../services/api';

const SERVICE_LABELS = {
  Plumbing: 'PL',
  'Electrical Repair': 'EL',
  'Home Cleaning': 'CL',
  'AC Repair': 'AC',
  Carpentry: 'CA',
  Painting: 'PA',
};

const getServiceLabel = (name) => {
  if (!name) return 'SV';
  const match = Object.keys(SERVICE_LABELS).find((key) => name.toLowerCase().includes(key.toLowerCase()));
  return match ? SERVICE_LABELS[match] : 'SV';
};

function BookModal({ service, onClose, onSuccess }) {
  const [form, setForm] = useState({ booking_date: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const serviceName = service.name || service.service_name;

  const validate = () => {
    const nextErrors = {};
    if (!form.booking_date) nextErrors.booking_date = 'Date is required';
    else if (form.booking_date < today) nextErrors.booking_date = 'Date cannot be in the past';
    if (!form.address.trim()) nextErrors.address = 'Address is required';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        service_id: service.id,
        booking_date: form.booking_date,
        address: form.address.trim(),
        notes: form.notes.trim(),
      });
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Book - {serviceName}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close booking form">x</button>
        </div>
        <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-sub)' }}>Price:</span>{' '}
          <strong style={{ color: 'var(--accent-light)' }}>Rs. {service.price}</strong>
          {service.estimated_duration && (
            <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>{service.estimated_duration}</span>
          )}
        </div>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Preferred Date</label>
            <input
              type="date"
              min={today}
              value={form.booking_date}
              onChange={(event) => {
                setForm({ ...form, booking_date: event.target.value });
                setErrors({ ...errors, booking_date: '' });
              }}
            />
            {errors.booking_date && <p className="form-error">{errors.booking_date}</p>}
          </div>
          <div className="form-group">
            <label>Service Address</label>
            <textarea
              rows={3}
              placeholder="Full address where service is needed..."
              value={form.address}
              onChange={(event) => {
                setForm({ ...form, address: event.target.value });
                setErrors({ ...errors, address: '' });
              }}
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Any special instructions..."
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then((res) => {
        const data = res.data?.services || [];
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Unable to load services. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSuccess = () => {
    setSelected(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  if (loading) {
    return (
      <Layout title="Services">
        <div className="loading-inline"><div className="spinner"></div></div>
      </Layout>
    );
  }

  return (
    <Layout title="Available Services">
      {success && <div className="alert alert-success">Booking confirmed. Check My Bookings for details.</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <p style={{ color: 'var(--text-sub)', marginBottom: 20, fontSize: '0.9rem' }}>
        Select a service below to book a visit at your home.
      </p>
      <div className="services-grid">
        {services.map((service) => {
          const serviceName = service.name || service.service_name;
          return (
            <div key={service.id} className="service-card" onClick={() => setSelected(service)}>
              <div className="service-icon">{getServiceLabel(serviceName)}</div>
              <div className="service-name">{serviceName}</div>
              <div className="service-desc">{service.description || 'Professional home service by trained experts.'}</div>
              <div className="service-meta">
                <span className="service-price">Rs. {service.price}</span>
                <span className="service-duration">{service.estimated_duration || 'Varies'}</span>
              </div>
            </div>
          );
        })}
      </div>
      {selected && <BookModal service={selected} onClose={() => setSelected(null)} onSuccess={handleSuccess} />}
    </Layout>
  );
}
