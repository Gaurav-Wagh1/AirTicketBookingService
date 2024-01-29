const express = require('express');
const { BookingController } = require('../../controller/index');

const router = express.Router();

router.post('/bookings', BookingController.create);

router.patch('/bookings/:id', BookingController.update);

router.get('/bookings/:id', BookingController.get);

module.exports = router;