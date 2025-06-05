const Carausel = require('../models/Carauselmodel');

// Create a new carousel item
const createCarausel = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const newCarausel = new Carausel({ imageUrl });
    const savedCarausel = await newCarausel.save();
    res.status(201).json(savedCarausel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all carousel items
const getCarausels = async (req, res) => {
  try {
    const carausels = await Carausel.find();
    res.status(200).json(carausels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single carousel item by ID
const getCarauselById = async (req, res) => {
  try {
    const carausel = await Carausel.findById(req.params.id);
    if (!carausel) {
      return res.status(404).json({ message: 'Carausel item not found' });
    }
    res.status(200).json(carausel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a carousel item by ID
const updateCarausel = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const updatedCarausel = await Carausel.findByIdAndUpdate(
      req.params.id,
      { imageUrl },
      { new: true }
    );
    if (!updatedCarausel) {
      return res.status(404).json({ message: 'Carausel item not found' });
    }
    res.status(200).json(updatedCarausel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a carousel item by ID
const deleteCarausel = async (req, res) => {
  try {
    const deletedCarausel = await Carausel.findByIdAndDelete(req.params.id);
    if (!deletedCarausel) {
      return res.status(404).json({ message: 'Carausel item not found' });
    }
    res.status(200).json({ message: 'Carausel item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCarausel,
  getCarausels,
  getCarauselById,
  updateCarausel,
  deleteCarausel,
};
