const express = require('express');
const router = express.Router();
const { getAllServices, getAllServicesAdmin, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, getAllServices);
router.get('/admin/all', adminMiddleware, getAllServicesAdmin);
router.post('/', adminMiddleware, createService);
router.put('/:id', adminMiddleware, updateService);
router.delete('/:id', adminMiddleware, deleteService);

module.exports = router;
