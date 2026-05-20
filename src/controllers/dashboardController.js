const { pool } = require('../config/db');

async function getUserDashboard(req, res) {
  try {
    const userId = req.user.id;

    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM bookings WHERE user_id = ?', [userId]);
    const [[{ upcoming }]] = await pool.query(
      "SELECT COUNT(*) as upcoming FROM bookings WHERE user_id = ? AND status IN ('pending', 'confirmed') AND booking_date >= CURDATE()",
      [userId]
    );
    const [[{ completed }]] = await pool.query(
      "SELECT COUNT(*) as completed FROM bookings WHERE user_id = ? AND status = 'completed'",
      [userId]
    );

    const [recentBookings] = await pool.query(
      `SELECT b.*, s.name as service_name, s.price
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC LIMIT 5`,
      [userId]
    );

    res.json({
      success: true,
      stats: { total, upcoming, completed },
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getAdminDashboard(req, res) {
  try {
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'");
    const [[{ totalBookings }]] = await pool.query('SELECT COUNT(*) as totalBookings FROM bookings');
    const [[{ activeProviders }]] = await pool.query(
      "SELECT COUNT(*) as activeProviders FROM service_providers WHERE availability_status = 'available'"
    );
    const [[{ pendingBookings }]] = await pool.query(
      "SELECT COUNT(*) as pendingBookings FROM bookings WHERE status = 'pending'"
    );
    const [[{ totalRevenue }]] = await pool.query(
      "SELECT COALESCE(SUM(s.price), 0) as totalRevenue FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.status = 'completed'"
    );

    const [recentBookings] = await pool.query(
      `SELECT b.*, u.name as user_name, s.name as service_name, s.price
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services s ON b.service_id = s.id
       ORDER BY b.created_at DESC LIMIT 8`
    );

    res.json({
      success: true,
      stats: { totalUsers, totalBookings, activeProviders, pendingBookings, totalRevenue },
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getUserDashboard, getAdminDashboard };
