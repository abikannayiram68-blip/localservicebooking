const express = require('express');
const router = express.Router();
const { getUserBookings, getAllBookings, createBooking, updateBooking } = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, getUserBookings);
router.get('/all', adminMiddleware, getAllBookings);
router.post('/', authMiddleware, createBooking);
router.put('/:id', authMiddleware, updateBooking);

module.exports = router;
