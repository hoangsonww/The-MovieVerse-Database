const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const config = require('./config');

// MySQL Connection
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Review Schema (Table) - Create if it doesn't exist
const createReviewTableQuery = `
    CREATE TABLE IF NOT EXISTS reviews (
           id INT AUTO_INCREMENT PRIMARY KEY,
           userId INT NOT NULL,
           movieId INT NOT NULL,
           rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        reviewText TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

async function generateFakeReviewData(numReviews) {
  const reviewData = [];
  for (let i = 0; i < numReviews; i++) {
    reviewData.push([
      faker.number.int({ min: 1, max: 100 }),
      faker.number.int({ min: 1, max: 500 }),
      faker.number.int({ min: 1, max: 10 }),
      faker.lorem.paragraph(),
    ]);
  }
  return reviewData;
}

async function seedReviews() {
  try {
    await pool.execute(createReviewTableQuery);

    const numReviewsToGenerate = 100;
    const reviewData = await generateFakeReviewData(numReviewsToGenerate);

    const insertQuery = 'INSERT INTO reviews (userId, movieId, rating, reviewText) VALUES ?';
    await pool.query(insertQuery, [reviewData]);

    console.log(`${numReviewsToGenerate} reviews inserted!`);
  } catch (err) {
    console.error('Error seeding reviews:', err);
  } finally {
    pool.end();
  }
}

seedReviews();
