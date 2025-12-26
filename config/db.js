const mongoose = require('mongoose');

let isConnecting = false;
let isConnected = false;

const connectDB = async () => {
    // Prevent multiple connection attempts
    if (isConnecting || isConnected) {
        return;
    }
    
    isConnecting = true;
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://sanjusazid41:8kILKkYcDKFUTN9P@cluster0.fdb48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000,
        });
        
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Don't throw - app continues without DB
        isConnecting = false;
    }
};

module.exports = connectDB; 