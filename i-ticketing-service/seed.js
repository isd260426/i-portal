import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Unit from './models/Unit.js';
import Category from './models/Category.js';

dotenv.config();

const unitsSeed = [
  { name: 'FAP', code: 'FAP' },
  { name: 'MCU', code: 'MCU' },
  { name: 'UGD', code: 'UGD' },
  { name: 'OPD', code: 'OPD' },
  { name: 'IPD', code: 'IPD' },
  { name: 'ADMIN', code: 'ADMIN' },
  { name: 'RADIOLOGI', code: 'RADIOLOGI' },
  { name: 'LABORATORIUM', code: 'LABORATORIUM' },
  { name: 'DOKTER', code: 'DOKTER' },
  { name: 'REKAM MEDIS', code: 'REKAM_MEDIS' },
  { name: 'ASSISTANT CENTER', code: 'ASSISTANT_CENTER' },
  { name: 'BILLING', code: 'BILLING' },
  { name: 'UPSP', code: 'UPSP' },
  { name: 'FARMASI', code: 'FARMASI' },
  { name: 'NUTRISIONIST', code: 'NUTRISIONIST' },
  { name: 'KIE (Komunikasi, Informasi & Edukasi)', code: 'KIE' },
  { name: 'LAINNYA', code: 'LAINNYA' }
];

const categoriesSeed = [
  { name: 'SIRS (Sistem Informasi RS)', code: 'SIRS', requiresRegister: true },
  { name: 'Jaringan & Internet', code: 'JARINGAN', requiresRegister: false },
  { name: 'Hardware (PC / Printer / Order / Repair)', code: 'HARDWARE', requiresRegister: false },
  { name: 'Lainnya', code: 'LAINNYA', requiresRegister: false }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_ticketing';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected.');

    // Seed Units
    await Unit.deleteMany({});
    console.log('Cleared existing Units.');
    await Unit.insertMany(unitsSeed);
    console.log(`Seeded ${unitsSeed.length} Units.`);

    // Seed Categories
    await Category.deleteMany({});
    console.log('Cleared existing Categories.');
    await Category.insertMany(categoriesSeed);
    console.log(`Seeded ${categoriesSeed.length} Categories.`);

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
