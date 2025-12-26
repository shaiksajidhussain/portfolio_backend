const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://sanjusazid41:8kILKkYcDKFUTN9P@cluster0.fdb48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Don't exit on serverless - just log the error
        // The app will still run, but without DB functionality
    }
};

module.exports = connectDB; 