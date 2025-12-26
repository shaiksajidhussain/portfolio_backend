const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB already connected (readyState: 1)');
        return mongoose.connection;
    }
    
    // If connection is in progress (state 2 = connecting), return the existing promise
    if (mongoose.connection.readyState === 2) {
        console.log('MongoDB connection in progress (readyState: 2), waiting...');
        if (connectionPromise) {
            return connectionPromise;
        }
    }
    
    // If connection is in progress, return the existing promise
    if (connectionPromise) {
        return connectionPromise;
    }
    
    // Start new connection
    connectionPromise = (async () => {
        try {
            const mongoURI = process.env.MONGODB_URI || "mongodb+srv://sanjusazid41:8kILKkYcDKFUTN9P@cluster0.fdb48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
            
            if (!mongoURI) {
                throw new Error('MONGODB_URI is not defined');
            }
            
            console.log('Attempting MongoDB connection...');
            
            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000,
                maxPoolSize: 10,
                minPoolSize: 1,
                bufferCommands: false, // Disable mongoose buffering for serverless
            });
            
            console.log('MongoDB connected successfully');
            return mongoose.connection;
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
            console.error('Error details:', {
                name: error.name,
                code: error.code,
                codeName: error.codeName
            });
            connectionPromise = null; // Reset on error so we can retry
            throw error;
        }
    })();
    
    return connectionPromise;
};

// Helper function to ensure DB is connected before operations
const ensureConnection = async () => {
    const readyState = mongoose.connection.readyState;
    
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (readyState === 1) {
        return; // Already connected
    }
    
    if (readyState === 2) {
        // Connection in progress, wait for it
        console.log('Connection in progress, waiting...');
        if (connectionPromise) {
            await connectionPromise;
            return;
        }
    }
    
    try {
        await connectDB();
    } catch (error) {
        console.error('Failed to ensure DB connection:', error.message);
        console.error('Full error:', error);
        throw error;
    }
};

module.exports = { connectDB, ensureConnection }; 