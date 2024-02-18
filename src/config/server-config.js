const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    DB_SYNC: process.env.DB_SYNC,
    QUEUE_NAME: process.env.QUEUE_NAME,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    AUTH_SERVICE_PATH: process.env.AUTH_SERVICE_PATH,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    FLIGHT_SERVICE_PATH: process.env.FLIGHT_SERVICE_PATH,
    BOOKING_BINDING_KEY: process.env.BOOKING_BINDING_KEY
}