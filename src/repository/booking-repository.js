const { ValidationError, AppError } = require('../utils/errors/index');
const { Booking } = require('../models/index');
const { StatusCodes } = require('http-status-codes');

class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                throw new ValidationError(error);
            }
            throw new AppError(
                "Repository Error",
                "Cannot create booking",
                "There was some issue in creating booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async get(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId);
            return booking;
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                throw new ValidationError(error);
            }
            throw new AppError(
                "Repository Error",
                "Cannot fetch booking",
                "There was some issue in fetching booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId, data) {
        try {
            const response = await Booking.update(data, {
                where: {
                    id: bookingId
                }
            });
            return response;
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                throw new ValidationError(error);
            }
            throw new AppError(
                "Repository Error",
                "Cannot update booking",
                "There was some issue in updating booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = BookingRepository;