require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const School = require('./models/School');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await School.deleteMany({});

    console.log('Creating admin accounts...');

    const admin1 = await User.create({
      email: 'admin@timely.com',
      password: 'admin123',
      name: 'System Administrator',
      role: 'admin',
    });

    const admin2 = await User.create({
      email: 'admin2@timely.com',
      password: 'admin123',
      name: 'Admin User 2',
      role: 'admin',
    });

    const admin3 = await User.create({
      email: 'superadmin@timely.com',
      password: 'super123',
      name: 'Super Administrator',
      role: 'admin',
    });

    console.log('Admin accounts created successfully!');
    console.log('\nLogin credentials:');
    console.log('1. Email: admin@timely.com, Password: admin123');
    console.log('2. Email: admin2@timely.com, Password: admin123');
    console.log('3. Email: superadmin@timely.com, Password: super123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
