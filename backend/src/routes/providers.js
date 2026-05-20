const express = require('express');
const router = express.Router();
const { getAllProviders, createProvider, updateProvider, deleteProvider } = require('../controllers/providerController');
const { adminMiddleware } = require('../middlewares/auth');

router.get('/', adminMiddleware, getAllProviders);
router.post('/', adminMiddleware, createProvider);
router.put('/:id', adminMiddleware, updateProvider);
router.delete('/:id', adminMiddleware, deleteProvider);

module.exports = router;
