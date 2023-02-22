const amqplib = require("amqplib");

const queueName = "hello";
const url = "amqp://localhost";
const receiveMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);
  // create channel
  const channel = await connection.createChannel();
  // create queue if it doesn't exist
  await channel.assertQueue(queueName, { durable: false });

  // close connection
    console.log(`Waiting messages from: ${queueName}`);
    
    // consume messages
    channel.consume(queueName, (msg) => {
        console.log(`[x] Received message: ${msg.content.toString()}`);
    }, { noAck: true });
    
};

receiveMsg();
