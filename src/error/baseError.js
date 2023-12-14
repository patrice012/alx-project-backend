class AppError extends Error {
    constructor(statusCode, message) {
        super();
        // super(message);
        this.statusCode = statusCode || 500;
        this.message = message || "Error Something went wrong";
    }
}

module.exports = AppError;
