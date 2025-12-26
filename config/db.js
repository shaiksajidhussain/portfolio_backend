const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sanjusazid41:8kILKkYcDKFUTN9P@cluster0.fdb48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 