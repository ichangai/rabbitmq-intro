const amqplib = require("amqplib");

const queueName = "hello";
const msg = "glorious purpose";
const url = "amqp://localhost";

const sendMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);
  // create channel
  const channel = await connection.createChannel();
  // create queue if it doesn't exist
  await channel.assertQueue(queueName, { durable: false });
  // send message to queue
  channel.sendToQueue(queueName, Buffer.from(msg));
  // close connection
  console.log(`Sent message: ${msg}`);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)

};

sendMsg();