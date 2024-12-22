const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Views', viewsSchema); 