const mongoose = require('mongoose');

const carauselSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  }
});

const Carausel = mongoose.model('Carausel', carauselSchema);

module.exports = Carausel;
