class CustomError extends Error {
    constructor(message, statusCode, payload) {
        super(message);
        this.statusCode = statusCode || 500; // Default status code is 500
        this.payload = payload || null;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;
