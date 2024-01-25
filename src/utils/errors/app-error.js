class AppError extends Error {
    constructor(
        name,
        message,
        explanation,
        statusCode
    ) {
        super();
        this.name = name;
        this.explanation = explanation;
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = AppError;