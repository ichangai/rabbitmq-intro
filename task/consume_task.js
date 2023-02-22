const amqplib = require("amqplib");

const queueName = "task";
const url = "amqp://localhost";
const receiveMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);
  // create channel
  const channel = await connection.createChannel();
  // create queue if it doesn't exist
  await channel.assertQueue(queueName, { durable: true });

  // set prefetch to 1. Do not send new message until previous message is acked
  channel.prefetch(1);

  // close connection
    console.log(`Waiting messages from: ${queueName}`);
    
    // consume messages
    channel.consume(queueName, (msg) => {
        const secs = msg.content.toString().split('.').length - 1;
      console.log(`[x] Received message: ${msg.content.toString()}`);
      setTimeout(() => {
        console.log(`[x] Done Rising image`);
        channel.ack(msg);
      }, secs * 1000);

    }, { noAck: false });
    
};

receiveMsg();
