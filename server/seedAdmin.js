import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const adminEmail = 'openforge@gvpce.ac.in';
    const adminPassword = 'OpenForge@it'; // Set the password you want

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.password = adminPassword;
      user.role = 'admin';
      user.isActive = true;
      // Saving via document triggers the pre('save') bcrypt hashing middleware
      await user.save();
      console.log(`Updated admin credentials for: ${adminEmail}`);
    } else {
      user = await User.create({
        name: 'OpenForge Admin',
        email: adminEmail,
        password: adminPassword,
        rollNumber: '324103311000',
        department: 'Information Technology',
        year: '4th Year',
        role: 'admin',
        isActive: true,
      });
      console.log(`Created new admin user: ${adminEmail}`);
    }

    console.log(`Admin ready to login with password: ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err);
    process.exit(1);
  }
};

seedAdmin();