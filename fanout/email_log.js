const amqplib = require("amqplib");

const exchangeName = "email_logs";
const msg = process.argv.slice(2).join(" ") || "Hello World!";
const url = "amqp://localhost";

const sendMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);

  // create channel
  const channel = await connection.createChannel();

  // publlish message to exchange
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  // publish message to queue
  channel.publish(exchangeName, "", Buffer.from(msg));

  // close connection
  console.log(`Sent message: ${msg}`);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
