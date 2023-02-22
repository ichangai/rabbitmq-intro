const amqplib = require("amqplib");

const exchangeName = "email_logs";

const url = "amqp://localhost";
const receiveMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);
  // create channel
  const channel = await connection.createChannel();

  // bind queue to exchange
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  // create queue if it doesn't exist
  // exclusive true is to delete a queue when the connection is closed
  const q = await channel.assertQueue('', { exclusive: true }); 

  console.log(`Waiting messages from: ${q.queue}`);

  // bind queue to exchange
  channel.bindQueue(q.queue, exchangeName, '');

    // consume messages
  channel.consume(q.queue, (msg) => {
    if (msg.content) {
        console.log(`Received message: ${msg.content.toString()}`);
      }
    }, { noAck: true });
};

receiveMsg();
