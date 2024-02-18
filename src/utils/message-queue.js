const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME } = require('../config/server-config');

// channel creation for message queue operations;
const createChannel = async () => {
    try {
        // creating a TCP connection between amqplib & RabbitMQ;
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);

        // this is a virtual connection over the TCP connection through which all the actions will be performed;
        const channel = await connection.createChannel();

        /**
         * here we are creating a exchange;
         * exchange is a part present in the broker which routes the 
           data/message over different queues present in broker;
         * arguments =>  nameofExchange, setUptype, additional argument;
         */
        channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


// enqueueing / publishing messages in message queue;
const publishMessage = async (channel, binding_key, message) => {
    try {
        // check weather the queue exists or not, if not create it;
        await channel.assertQueue(QUEUE_NAME);

        // bind queue with the exchange;
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, binding_key);

        // publish message
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


// subscribing / consuming messages;
/*
const subscribeMessage = async (channel, binding_key) => {
    try {
        await channel.assertQueue(QUEUE_NAME);
        // channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        await channel.consume(QUEUE_NAME, (msg) => {
            console.log("Received data", msg.content.toString());
            channel.ack(msg);
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}
*/

module.exports = {
    createChannel,
    publishMessage
    // subscribeMessage,
}