const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Create project (protected)
router.post('/', auth, projectController.createProject);

// Get all projects (public)
router.get('/', projectController.getProjects);

// Get single project by ID (public)
router.get('/:id', projectController.getProjectById);

// Update project (protected)
router.put('/:id', auth, projectController.updateProject);

// Delete project (protected)
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router; 