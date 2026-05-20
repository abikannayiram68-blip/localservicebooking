const { pool } = require('../config/db');

async function getAllProviders(req, res) {
  try {
    const [providers] = await pool.query('SELECT * FROM service_providers ORDER BY created_at DESC');
    res.json({ success: true, providers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createProvider(req, res) {
  try {
    const { name, phone, skill_type, availability_status } = req.body;

    if (!name || !phone || !skill_type) {
      return res.status(400).json({ success: false, message: 'Name, phone, and skill type are required' });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number (must be 10 digits starting with 6-9)' });
    }

    const [result] = await pool.query(
      'INSERT INTO service_providers (name, phone, skill_type, availability_status) VALUES (?, ?, ?, ?)',
      [name, phone, skill_type, availability_status || 'available']
    );

    const [newProvider] = await pool.query('SELECT * FROM service_providers WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Provider added', provider: newProvider[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updateProvider(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, skill_type, availability_status, rating } = req.body;

    const [existing] = await pool.query('SELECT id FROM service_providers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    await pool.query(
      'UPDATE service_providers SET name=?, phone=?, skill_type=?, availability_status=?, rating=? WHERE id=?',
      [name, phone, skill_type, availability_status, rating || 0, id]
    );

    const [updated] = await pool.query('SELECT * FROM service_providers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Provider updated', provider: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function deleteProvider(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM service_providers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Provider deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getAllProviders, createProvider, updateProvider, deleteProvider };
