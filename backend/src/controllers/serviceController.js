const { pool } = require('../config/db');

async function getAllServices(req, res) {
  try {
    const [services] = await pool.query(
      'SELECT * FROM services WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getAllServicesAdmin(req, res) {
  try {
    const [services] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createService(req, res) {
  try {
    const { name, description, price, estimated_duration } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Service name and price are required' });
    }
    if (name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Service name cannot be empty' });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be a positive number' });
    }

    const [result] = await pool.query(
      'INSERT INTO services (name, description, price, estimated_duration) VALUES (?, ?, ?, ?)',
      [name.trim(), description || null, price, estimated_duration || null]
    );

    const [newService] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Service created', service: newService[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, estimated_duration, is_active } = req.body;

    const [existing] = await pool.query('SELECT id FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await pool.query(
      'UPDATE services SET name=?, description=?, price=?, estimated_duration=?, is_active=? WHERE id=?',
      [name, description, price, estimated_duration, is_active !== undefined ? is_active : true, id]
    );

    const [updated] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service updated', service: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    await pool.query('UPDATE services SET is_active = FALSE WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getAllServices, getAllServicesAdmin, createService, updateService, deleteService };
