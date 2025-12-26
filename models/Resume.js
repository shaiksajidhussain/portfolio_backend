const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        description: 'Title/name of the resume (e.g., "Full Stack Developer Resume")'
    },
    url: {
        type: String,
        required: true,
        description: 'URL to the resume file'
    },
    fileSize: {
        type: String,
        description: 'File size (e.g., "2.5 MB")'
    },
    fileType: {
        type: String,
        default: 'PDF',
        description: 'File type (PDF, DOCX, etc.)'
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
        description: 'When the resume was uploaded'
    },
    isActive: {
        type: Boolean,
        default: true,
        description: 'Whether this resume is currently active/visible'
    },
    downloadCount: {
        type: Number,
        default: 0,
        description: 'Number of times the resume was downloaded'
    },
    description: {
        type: String,
        description: 'Additional description about the resume'
    }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
