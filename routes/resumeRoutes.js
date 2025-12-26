const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');

// Public routes
// Get all active resumes
router.get('/', resumeController.getAllResumes);

// Get a specific resume by ID
router.get('/:id', resumeController.getResumeById);

// Increment download count (public)
router.post('/:id/download', resumeController.incrementDownloadCount);

// Protected routes (require authentication)
// Create a new resume
router.post('/', auth, resumeController.createResume);

// Update a resume
router.put('/:id', auth, resumeController.updateResume);

// Delete a resume
router.delete('/:id', auth, resumeController.deleteResume);

module.exports = router;
