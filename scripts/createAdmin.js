const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/secrets');

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        
        // Create admin user
        await Admin.create({
            email: ADMIN_EMAIL,
            password: hashedPassword
        });
        
        console.log('Admin created successfully');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.disconnect();
    }
}

createAdmin(); 