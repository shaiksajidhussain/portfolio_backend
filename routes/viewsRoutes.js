const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

// Get views for a section
router.get('/:section', viewsController.getViews);

// Increment views for a section
router.post('/:section', viewsController.incrementViews);

module.exports = router; 