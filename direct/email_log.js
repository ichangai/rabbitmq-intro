const amqplib = require("amqplib");

const exchangeName = "direct_logs";
const args = process.argv.slice(2);
const msg = args[1] || "Hello World!";
const url = "amqp://localhost";
const logType = args[0];

console.log(args, msg, logType);

const sendMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);

  // create channel
  const channel = await connection.createChannel();

  // create exchange
  await channel.assertExchange(exchangeName, "direct", { durable: false });

  // publish message to queue
  channel.publish(exchangeName, logType, Buffer.from(msg));

  // close connection
  console.log(`Sent message: ${msg}`);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
