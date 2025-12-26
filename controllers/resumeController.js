const Resume = require('../models/Resume');

// Get all resumes (public endpoint)
exports.getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ isActive: true }).sort({ uploadedAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Error fetching resumes', error: error.message });
    }
};

// Get a single resume by ID
exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Error fetching resume', error: error.message });
    }
};

// Create a new resume (protected)
exports.createResume = async (req, res) => {
    try {
        const { title, url, fileSize, fileType, description } = req.body;

        // Validate required fields
        if (!title || !url) {
            return res.status(400).json({ message: 'Title and URL are required' });
        }

        const newResume = new Resume({
            title,
            url,
            fileSize: fileSize || 'Unknown',
            fileType: fileType || 'PDF',
            description,
            isActive: true
        });

        const savedResume = await newResume.save();
        res.status(201).json({
            message: 'Resume created successfully',
            resume: savedResume
        });
    } catch (error) {
        console.error('Error creating resume:', error);
        res.status(500).json({ message: 'Error creating resume', error: error.message });
    }
};

// Update a resume (protected)
exports.updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, fileSize, fileType, description, isActive } = req.body;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Update fields
        if (title) resume.title = title;
        if (url) resume.url = url;
        if (fileSize) resume.fileSize = fileSize;
        if (fileType) resume.fileType = fileType;
        if (description !== undefined) resume.description = description;
        if (isActive !== undefined) resume.isActive = isActive;

        const updatedResume = await resume.save();
        res.status(200).json({
            message: 'Resume updated successfully',
            resume: updatedResume
        });
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ message: 'Error updating resume', error: error.message });
    }
};

// Delete a resume (protected)
exports.deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await Resume.findByIdAndDelete(id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({
            message: 'Resume deleted successfully',
            deletedResume: resume
        });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Error deleting resume', error: error.message });
    }
};

// Increment download count
exports.incrementDownloadCount = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await Resume.findByIdAndUpdate(
            id,
            { $inc: { downloadCount: 1 } },
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({
            message: 'Download count updated',
            resume
        });
    } catch (error) {
        console.error('Error updating download count:', error);
        res.status(500).json({ message: 'Error updating download count', error: error.message });
    }
};
