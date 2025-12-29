const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    // Images
    image: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    image1: {
        type: String
    },
    image2: {
        type: String
    },
    image3: {
        type: String
    },
    image4: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    orderNumber: {
        type: Number
    },
    // Links
    liveLink: {
        type: String
    },
    githubLink: {
        type: String
    },
    webapp: {
        type: String
    },
    github: {
        type: String
    },
    // Client & Results
    client: {
        type: String
    },
    result: {
        type: String
    },
    testimonial: {
        type: String
    },
    // Technology Stack
    tech: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    // Team Members
    member: [{
        name: String,
        img: String,
        linkedin: String,
        github: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema); 