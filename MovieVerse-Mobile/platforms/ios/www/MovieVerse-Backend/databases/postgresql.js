const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const config = require('./config');

const pool = new Pool({
  user: config.POSTGRES_USER,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
});

// User Account Table Creation (if not exists)
const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
         id SERIAL PRIMARY KEY,
         username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        profilePictureUrl TEXT,
        bio TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

async function generateFakeUserData(numUsers) {
  const userData = [];
  const saltRounds = 10;

  for (let i = 0; i < numUsers; i++) {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    userData.push([
      faker.internet.userName(),
      faker.internet.email(),
      hashedPassword,
      faker.person.firstName(), // Use faker.person instead of faker.name
      faker.person.lastName(), // Use faker.person instead of faker.name
      faker.image.avatar(),
      faker.lorem.sentence(),
    ]);
  }
  return userData;
}

// Insert users into PostgreSQL
async function seedUsers() {
  try {
    const client = await pool.connect();

    await client.query(createUserTableQuery);

    const numUsersToGenerate = 100;
    const userData = await generateFakeUserData(numUsersToGenerate);

    const placeholders = userData
      .map(
        (_, index) =>
          `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
      )
      .join(', ');

    const insertQuery = `
            INSERT INTO users (username, email, passwordHash, firstName, lastName, profilePictureUrl, bio) 
            VALUES ${placeholders}`;
    const values = userData.flat();

    await client.query(insertQuery, values);
    console.log(`${numUsersToGenerate} users inserted!`);
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    pool.end();
  }
}

seedUsers();
