import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CitizenMaster from './src/models/citizenMaster.model.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await CitizenMaster.deleteMany({ voterId: 'ABC1234567' });

    await CitizenMaster.create({
      firstName: 'Madan',
      lastName: 'Lal',
      dateOfBirth: new Date('2000-01-01'),
      gender: 'Male',
      voterId: 'ABC1234567',
      aadhaarHash: '123456789012',
      mobile: '9876543210',
      email: 'madan@gmail.com',
      state: 'Telangana',
      district: 'Khammam',
      constituency: 'Wyra',
      pollingStation: 'Station 1',
      isActive: true,
    });

    console.log('✅ Test citizen inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();