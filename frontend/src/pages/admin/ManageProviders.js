import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getProviders, createProvider, updateProvider, deleteProvider } from '../../services/api';

const EMPTY = { name: '', phone: '', skill_type: '', availability_status: 'available', rating: 0 };
const SKILLS = ['Plumbing', 'Electrical Repair', 'Home Cleaning', 'AC Repair', 'Carpentry', 'Painting'];

export default function ManageProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetch = () => getProviders().then(res => setProviders(res.data.providers)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.skill_type) { setError('All fields are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateProvider(editing.id, form);
        setMessage('Provider updated!');
      } else {
        await createProvider(form);
        setMessage('Provider added!');
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
    if (!window.confirm('Delete this provider?')) return;
    await deleteProvider(id);
    setMessage('Provider deleted.');
    fetch();
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <Layout title="Service Providers"><div className="loading-inline"><div className="spinner"></div></div></Layout>;

  return (
    <Layout title="Service Providers">
      {message && <div className="alert alert-success">{message}</div>}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Providers ({providers.length})</span>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Provider</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Skill</th><th>Rating</th><th>Availability</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {providers.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.skill_type}</td>
                  <td>
                    <span style={{ color: 'var(--accent4)', fontWeight: 700 }}>
                      {p.rating > 0 ? `⭐ ${parseFloat(p.rating).toFixed(1)}` : '—'}
                    </span>
                  </td>
                  <td><span className={`badge badge-${p.availability_status}`}>{p.availability_status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No providers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Provider' : 'Add Provider'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Provider's name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
                </div>
                <div className="form-group">
                  <label>Skill Type</label>
                  <select value={form.skill_type} onChange={e => setForm({ ...form, skill_type: e.target.value })}>
                    <option value="">Select skill...</option>
                    {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Availability</label>
                  <select value={form.availability_status} onChange={e => setForm({ ...form, availability_status: e.target.value })}>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating}
                    onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="0.0" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2 }}>
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
