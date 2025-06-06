const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    category: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    github: {
        type: String
    },
    webapp: {
        type: String
    },
    member: [{
        name: String,
        img: String,
        linkedin: String,
        github: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema); 