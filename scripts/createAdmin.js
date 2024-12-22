require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        // Create admin user
        await Admin.create({
            email: process.env.ADMIN_EMAIL,
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