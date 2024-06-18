const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql2');
const redis = require('redis');
const amqp = require('amqplib');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');
const { Pool } = require('pg');

const app = express();

// Connect to MySQL
const mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DB
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

const mongoURIs = [
    { uri: config.MONGO_URI1, name: "MovieVerse" },  // Add database names here
    { uri: config.MONGO_URI2, name: "MovieVerse_movies" },
    { uri: config.MONGO_URI3, name: "MovieVerse_users" },
    { uri: config.MONGO_URI4, name: "MovieVerse_reviews" },
    { uri: config.MONGO_URI5, name: "MovieVerse_people" },
    { uri: config.MONGO_URI6, name: "MovieVerse_genres" }
];

// Connect to each MongoDB URI
mongoURIs.forEach(async ({ uri, name }, index) => { // Destructure uri and name
    try {
        await mongoose.createConnection(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to MongoDB database ${index + 1}: ${name}`); // Log the name
    } catch (err) {
        console.error(`MongoDB Connection Error ${index + 1} (${name}):`, err); // Log the name in the error too
    }
});

// Connect to Redis
const redisClient = redis.createClient({
    url: `redis://${config.redisHost}:${config.redisPort}`
});

redisClient
    .connect()
    .then(() => {
        console.log('Redis Connected');
        // Test Redis by setting and getting a simple key-value pair
        return redisClient.set('testKey', 'Hello from Redis');
    })
    .then(() => redisClient.get('testKey'))
    .then(value => console.log(`Redis Test: ${value}`))
    .catch(err => console.error('Redis Connection Error:', err));

// PostgreSQL Connection Pool
const pgPool = new Pool({
    user: config.POSTGRES_USER,
    host: config.POSTGRES_HOST,
    database: config.POSTGRES_DB,
    password: config.POSTGRES_PASSWORD,
    port: config.POSTGRES_PORT,
});

// Connect to PostgreSQL
pgPool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pgPool.on('error', (err) => {
    console.error('PostgreSQL Connection Error:', err);
});

// Test PostgreSQL Connection
(async () => {
    try {
        const client = await pgPool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('PostgreSQL Test:', result.rows[0].now);
        client.release();
    }
    catch (err) {
        console.error('PostgreSQL Test Error:', err);
    }
})();

app.get('/', (req, res) => {
    const message = 'Congratulations! MovieVerse server is running! MongoDB, MySQL, PostgreSQL, and Redis connections have been established.';
    console.log(message);
    res.send(message);
});

const PORT = config.port || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/ to test the connection.`);
});

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect(`amqp://${config.rabbitMQHost}`);
        const channel = await connection.createChannel();
        const queue = 'task_queue';

        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);

        console.log('RabbitMQ Connected');

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, async (msg) => {
            const content = msg.content.toString();
            console.log(" [x] Received %s", content);

            // Simulate a long-running task
            await new Promise(resolve => setTimeout(resolve, 10000));

            console.log(" [x] Done");

            channel.ack(msg);
        }, { noAck: false });
    }
    catch (error) {
        console.error('RabbitMQ Connection Error:', error);
    }
}

connectToRabbitMQ();

module.exports = app;
