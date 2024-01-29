const { StatusCodes } = require('http-status-codes');

const validateGenerateBooking = (req, res, next) => {
    const bodyData = req.body;
    if (!bodyData.flightId || !bodyData.userId || !bodyData.noOfSeats) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {},
            status: false,
            error: "Insufficient data!",
            message: "Please provide the proper data for booking the flight"
        });
    }
    next();
}


const validateUpdateBooking = (req, res, next) => {
    const bodyData = req.body;
    if (!bodyData.flightId && !bodyData.noOfSeats) {
        if (!bodyData.flightId || !bodyData.userId || !bodyData.noOfSeats) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                data: {},
                status: false,
                error: "Insufficient data!",
                message: "Please provide the proper data for updating the already booked flight!"
            });
        }
    }
    next();
}

module.exports = {
    validateGenerateBooking,
    validateUpdateBooking
}