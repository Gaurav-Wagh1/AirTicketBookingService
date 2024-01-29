const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes');

const bookingService = new BookingService();

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.CREATED).json({
            data: response,
            success: true,
            error: {},
            message: "Successfully booked the flight!"
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            error: error.message,
            message: error.explanation
        });
    }
}

const update = async (req, res) => {
    try {
        const response = await bookingService.updateBooking(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            error: {},
            message: "Successfully updated the flight !"
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            error: error.message,
            message: error.explanation
        });
    }
}

const get = async (req, res) => {
    try {
        const response = await bookingService.getBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            error: {},
            message: "Successfully fetched the flight"
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            error: error.message,
            message: error.explanation
        });
    }
}

module.exports = {
    create,
    update,
    get
};