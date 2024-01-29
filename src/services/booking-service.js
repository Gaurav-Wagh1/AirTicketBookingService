const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/server-config');
const { ServiceError } = require('../utils/errors/index');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    // payment gateway can be implemented before sending the success response;
    async createBooking(data) {
        try {
            const { flightId, noOfSeats } = data;

            // getting the desired flight from the flightSearch microservice;
            const flightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.get(flightUrl);

            const { price, totalSeats } = flight.data.data;

            // if requested seats are more than the total available seats of the flight;
            if (noOfSeats > totalSeats) {
                throw new ServiceError(
                    "Something went wrong in the booking process",
                    "Insufficient seats in the flight",
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }

            // updating the seats of the flights using flightSearch microservice;
            const flightUpdateURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(flightUpdateURL, { totalSeats: totalSeats - noOfSeats });

            // calculating the total cost;
            const totalCost = price * noOfSeats;

            // updating the booking table with all the necessary information / data;
            const bookingPayload = { ...data, totalCost, status: 'Booked' };
            const booking = await this.bookingRepository.create(bookingPayload);

            return booking;

        } catch (error) {
            if (
                error.name == "SequelizeValidationError" ||
                error.name == "ValidationError" ||
                error.name == "ServiceError"
            ) {
                throw error;
            }
            throw new ServiceError();
        }
    }


    // payment gateway can be implemented before sending the success response;
    async updateBooking(bookingId, data) {
        try {
            // this is the flag for checking weather both the conditions 
            // executes successfully or not;
            const updatedFlag = true;

            if (data.flightId) {
                const booking = await this.bookingRepository.get(bookingId);

                // getting the existing flight id from booking object;
                const existingFlightId = booking.flightId;
                const existingFlightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${existingFlightId}`;

                // removing user's seats from the old/existing flight;
                const existingFlight = await axios.get(existingFlightURL);

                const existingFlightUpdateResponse = await axios.patch(existingFlightURL,
                    {
                        totalSeats: existingFlight.data.data.totalSeats + booking.noOfSeats
                    }
                );

                if (!existingFlightUpdateResponse) {
                    throw new ServiceError(
                        "Cannot update existing flight data",
                        "Not able to remove the seats from the existing flight!"
                    );
                }

                const newFlightId = data.flightId;
                const newFlightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${newFlightId}`;
                const newFlight = await axios.get(newFlightURL);


                // adding user's seats in new flight;
                const newFlightUpdateResponse = await axios.patch(newFlightURL,
                    {
                        totalSeats: newFlight.data.data.totalSeats - booking.noOfSeats
                    }
                );

                if (!newFlightUpdateResponse) {
                    throw new ServiceError(
                        "Cannot update new flight data",
                        "Not able to add the seats into the new flight!"
                    );
                }


                // calculating the cost by new flight seat cost;
                const updatedCost = newFlight.data.data.price * booking.noOfSeats;


                // updating flightId and new/updated cost in the booking table;
                const response = await this.bookingRepository.update(bookingId,
                    {
                        flightId: data.flightId,
                        totalCost: updatedCost
                    }
                );

                // if some error occurred, flag will be 0/false;
                if (!response) {
                    updatedFlag = false;
                }
            }

            if (data.noOfSeats) {
                // current booking object;
                const booking = await this.bookingRepository.get(bookingId);

                // updating the seats in existing flight;
                const existingFlightId = booking.flightId;
                const existingFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${existingFlightId}`;

                const flight = await axios.get(existingFlightUrl);
                const flightData = flight.data.data;

                const updatedSeatCount = data.noOfSeats;

                if (updatedSeatCount > flightData.totalSeats) {
                    throw new ServiceError(
                        "Something went wrong in the booking process",
                        "Insufficient seats in the flight",
                        StatusCodes.INTERNAL_SERVER_ERROR
                    )
                }

                let flightUpdateSeat;
                if (updatedSeatCount > booking.noOfSeats) {
                    flightUpdateSeat = flightData.totalSeats - (updatedSeatCount - booking.noOfSeats);
                } else if (updatedSeatCount < booking.noOfSeats) {
                    flightUpdateSeat = flightData.totalSeats + (booking.noOfSeats - updatedSeatCount);
                }

                await axios.patch(existingFlightUrl, { totalSeats: flightUpdateSeat });

                const updatedCost = updatedSeatCount * flightData.price;

                // updating the cost according to added / removed seats;
                // and updating the new added / removed seats in the flight;
                const response = this.bookingRepository.update(bookingId,
                    {
                        noOfSeats: updatedSeatCount,
                        totalCost: updatedCost
                    }
                );

                // if some error occurred, flag will be 0/false;
                if (!response) {
                    updatedFlag = false;
                }
            }

            if (!updatedFlag) {
                throw new ServiceError(
                    "Cannot update the flight",
                    "Some error ocurred while updating the flight !"
                );
            }
            return true;
        } catch (error) {
            if (
                error.name == "SequelizeValidationError" ||
                error.name == "ValidationError" ||
                error.name == "ServiceError"
            ) {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async getBooking(bookingId) {
        try {
            const booking = await this.bookingRepository.get(bookingId);
            return booking;
        } catch (error) {
            if (
                error.name == "SequelizeValidationError" ||
                error.name == "ValidationError" ||
                error.name == "ServiceError"
            ) {
                throw error;
            }
            throw new ServiceError();
        }
    }
}


module.exports = BookingService;