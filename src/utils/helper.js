const generatePayload = (serviceName, emailId, time) => {
    switch (serviceName) {

        case 'SEND_EMAIL':
            // as it's an immediate confirmation mail, so no need of mailing time;
            return {
                data: {
                    subject: "Confirmation of booking",
                    content: "Your flight booking is successful, boarding pass will be available 48hrs prior the departure time",
                    recepientEmail: emailId
                },
                service: serviceName
            };

        case 'CREATE_TICKET':
            // as it's an reminder mail, that's why here we'll pass the time at which the email will be sent;
            return {
                data: {
                    subject: "Boarding pass for booking",
                    content: "The boarding pass for your flight which is scheduled after 48hrs from now is attached below",
                    recepientEmail: emailId,
                    notificationTime: time
                },
                service: serviceName
            };

        default:
            break;
    }
}

module.exports = {
    generatePayload
}