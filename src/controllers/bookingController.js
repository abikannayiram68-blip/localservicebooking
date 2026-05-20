const { pool } = require('../config/db');

async function getUserBookings(req, res) {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, s.name as service_name, s.price, s.estimated_duration,
              sp.name as provider_name, sp.phone as provider_phone
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN service_providers sp ON b.provider_id = sp.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getAllBookings(req, res) {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, u.name as user_name, u.email as user_email,
              s.name as service_name, s.price,
              sp.name as provider_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services s ON b.service_id = s.id
       LEFT JOIN service_providers sp ON b.provider_id = sp.id
       ORDER BY b.created_at DESC`
    );
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createBooking(req, res) {
  try {
    const { service_id, booking_date, address, notes } = req.body;

    if (!service_id || !booking_date || !address) {
      return res.status(400).json({ success: false, message: 'Service, date, and address are required' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (booking_date < today) {
      return res.status(400).json({ success: false, message: 'Booking date cannot be in the past' });
    }

    // Check service exists
    const [services] = await pool.query('SELECT id FROM services WHERE id = ? AND is_active = TRUE', [service_id]);
    if (services.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found or inactive' });
    }

    // Auto-assign an available provider for this skill
    const [providers] = await pool.query(
      `SELECT sp.id FROM service_providers sp
       JOIN services s ON s.name LIKE CONCAT('%', sp.skill_type, '%') OR sp.skill_type LIKE CONCAT('%', s.name, '%')
       WHERE sp.availability_status = 'available' AND s.id = ?
       LIMIT 1`,
      [service_id]
    );
    const provider_id = providers.length > 0 ? providers[0].id : null;

    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, service_id, provider_id, booking_date, address, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, service_id, provider_id, booking_date, address.trim(), notes || null]
    );

    const [newBooking] = await pool.query(
      `SELECT b.*, s.name as service_name, sp.name as provider_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN service_providers sp ON b.provider_id = sp.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking[0] });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { status, provider_id } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Users can only cancel their own bookings
    if (req.user.role !== 'admin') {
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ success: false, message: 'Users can only cancel bookings' });
      }
      if (booking.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });
      }
      if (booking.status === 'cancelled') {
        return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
      }
    }

    await pool.query(
      'UPDATE bookings SET status = ?, provider_id = COALESCE(?, provider_id) WHERE id = ?',
      [status, provider_id || null, id]
    );

    const [updated] = await pool.query(
      `SELECT b.*, s.name as service_name, sp.name as provider_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN service_providers sp ON b.provider_id = sp.id
       WHERE b.id = ?`,
      [id]
    );

    res.json({ success: true, message: 'Booking updated', booking: updated[0] });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getUserBookings, getAllBookings, createBooking, updateBooking };
