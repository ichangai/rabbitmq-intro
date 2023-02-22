const amqplib = require("amqplib");

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs.js [info] [warning] [error]");
  process.exit(1);
}


const exchangeName = "direct_logs";
const url = "amqp://localhost";



const receiveMsg = async () => {
  // create connection
  const connection = await amqplib.connect(url);
  // create channel
  const channel = await connection.createChannel();

  // create exchange
  await channel.assertExchange(exchangeName, "direct", { durable: false });

  // create queue if it doesn't exist
  // exclusive true is to delete a queue when the connection is closed
  const q = await channel.assertQueue('', { exclusive: true }); 

  console.log(`Waiting messages from: ${q.queue}`);

  // bind queue to exchange
  args.forEach((logType) => {
    channel.bindQueue(q.queue, exchangeName, logType);
  });

    // consume messages
  channel.consume(q.queue, (msg) => {
    if (msg.content) {
        console.log(`Routing key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
      }
    }, { noAck: true });
};

receiveMsg();
