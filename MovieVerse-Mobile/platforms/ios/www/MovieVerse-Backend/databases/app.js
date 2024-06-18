const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql2');
const redis = require('redis');
const amqp = require('amqplib');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');

const app = express();

// Connect to MySQL
const mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',      // Change to localhost
    user: config.MYSQL_USER,  // Make sure it's 'root' if you're using that
    password: config.MYSQL_PASSWORD, // Correct password if you're using one
    database: config.MYSQL_DB // Ensure the database exists
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Connect to MongoDB
mongoose
    .connect(config.MONGO_URI1, { })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err));

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

app.get('/', (req, res) => {
    const message = 'Congratulations! MovieVerse server is running! MongoDB, MySQL, and Redis connections have been established.';
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
