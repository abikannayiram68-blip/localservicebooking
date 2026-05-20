import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getServicesAdmin, createService, updateService, deleteService } from '../../services/api';

const EMPTY = { name: '', description: '', price: '', estimated_duration: '', is_active: true };

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetch = () => getServicesAdmin().then(res => setServices(res.data.services)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Service name is required'); return; }
    if (!form.price || isNaN(form.price) || form.price <= 0) { setError('Valid price is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateService(editing.id, form);
        setMessage('Service updated!');
      } else {
        await createService(form);
        setMessage('Service created!');
      }
      closeModal();
      fetch();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this service?')) return;
    await deleteService(id);
    setMessage('Service deactivated.');
    fetch();
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <Layout title="Manage Services"><div className="loading-inline"><div className="spinner"></div></div></Layout>;

  return (
    <Layout title="Manage Services">
      {message && <div className="alert alert-success">{message}</div>}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Services</span>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Service</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Price</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text)', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>₹{s.price}</td>
                  <td>{s.estimated_duration || '—'}</td>
                  <td><span className={`badge ${s.is_active ? 'badge-confirmed' : 'badge-cancelled'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      {s.is_active && <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Disable</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Service' : 'Add Service'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Plumbing" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Service description..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="499" />
                </div>
                <div className="form-group">
                  <label>Est. Duration</label>
                  <input value={form.estimated_duration} onChange={e => setForm({ ...form, estimated_duration: e.target.value })} placeholder="2-3 hours" />
                </div>
              </div>
              {editing && (
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.is_active ? 'true' : 'false'} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2 }}>
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
