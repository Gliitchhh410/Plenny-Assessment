import { connectDB, disconnectDB } from './db';
import { Brand } from './schemas/brand.schema';
import { faker } from '@faker-js/faker';

const runSeed = async () => {
  await connectDB();
  console.log('Starting data seeding...');

  const currentYear = new Date().getFullYear();
  const newBrands: any[] = [];

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1600,
    numberOfLocations: 1,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: currentYear,
    numberOfLocations: 55000,
  });


  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1750,
    numberOfLocations: 45,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1999,
    numberOfLocations: 3,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: currentYear - 1,
    numberOfLocations: 2,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1985,
    numberOfLocations: 150,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1920,
    numberOfLocations: 12500,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1924,
    numberOfLocations: 5,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 1955,
    numberOfLocations: 850,
  });

  newBrands.push({
    name: faker.company.name(),
    yearFounded: 2012,
    numberOfLocations: 350,
  });

  try {
    await Brand.insertMany(newBrands);
    console.log(`Successfully seeded ${newBrands.length} distinct brand test cases.`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

  await disconnectDB();
};

runSeed().catch(console.error);