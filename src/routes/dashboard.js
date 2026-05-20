const express = require('express');
const router = express.Router();
const { getUserDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/user', authMiddleware, getUserDashboard);
router.get('/admin', adminMiddleware, getAdminDashboard);

module.exports = router;
