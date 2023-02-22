const amqplib = require("amqplib");

const queueName = "task";
const msg = process.argv.slice(2).join(" ") || "Hello World!";
const url = "amqp://localhost";

const sendMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);
  // create channel
  const channel = await connection.createChannel();
  // create queue if it doesn't exist
  await channel.assertQueue(queueName, { durable: true });
  // send message to queue
  channel.sendToQueue(queueName, Buffer.from(msg), {persistent: true});
  // close connection
  console.log(`Sent message: ${msg}`);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)

};

sendMsg();