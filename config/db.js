const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    
    // If connection is in progress, return the existing promise
    if (connectionPromise) {
        return connectionPromise;
    }
    
    // Start new connection
    connectionPromise = (async () => {
        try {
            const mongoURI = process.env.MONGODB_URI || "mongodb+srv://sanjusazid41:8kILKkYcDKFUTN9P@cluster0.fdb48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
            
            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                bufferCommands: false, // Disable mongoose buffering for serverless
                bufferMaxEntries: 0, // Disable mongoose buffering
            });
            
            console.log('MongoDB connected successfully');
            return mongoose.connection;
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
            connectionPromise = null; // Reset on error so we can retry
            throw error;
        }
    })();
    
    return connectionPromise;
};

// Helper function to ensure DB is connected before operations
const ensureConnection = async () => {
    if (mongoose.connection.readyState === 1) {
        return; // Already connected
    }
    
    try {
        await connectDB();
    } catch (error) {
        console.error('Failed to ensure DB connection:', error.message);
        throw error;
    }
};

module.exports = { connectDB, ensureConnection }; 