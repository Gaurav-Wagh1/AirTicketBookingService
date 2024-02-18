const express = require('express');
const { BookingController } = require('../../controller/index');

const {
    validateGenerateBooking,
    validateUpdateBooking
} = require('../../middlewares/booking-middleware');

const router = express.Router();

router.post('/bookings', validateGenerateBooking, BookingController.create);

router.patch('/bookings/:id', validateUpdateBooking, BookingController.update);

router.get('/bookings/:id', BookingController.get);

module.exports = router;