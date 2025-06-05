const express = require('express');
const router = express.Router();
const { createCarausel, getCarausels, getCarauselById, updateCarausel, deleteCarausel } = require('../controllers/carauselController');

// POST /api/carausels - Create a new carousel item
router.post('/', createCarausel);

// GET /api/carausels - Get all carousel items
router.get('/', getCarausels);

// GET /api/carausels/:id - Get a single carousel item by ID
router.get('/:id', getCarauselById);

// PUT /api/carausels/:id - Update a carousel item by ID
router.put('/:id', updateCarausel);

// DELETE /api/carausels/:id - Delete a carousel item by ID
router.delete('/:id', deleteCarausel);

module.exports = router;
