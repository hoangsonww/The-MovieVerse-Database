const amqp = require('amqplib');
const config = require('./config');

async function publishMessage() {
  try {
    const connection = await amqp.connect(`amqp://${config.rabbitMQHost}`);
    const channel = await connection.createChannel();
    const queue = 'task_queue';

    await channel.assertQueue(queue, { durable: true });

    const message = 'Hello from RabbitMQ'; // Test string - to be replaced by backend data
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log('Message published:', message);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}

publishMessage();
