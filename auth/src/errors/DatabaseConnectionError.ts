import { CustomError } from "./customError";

class DatabaseConnectionError extends CustomError {
    reason = 'Error while connecting to a database.'
    statusCode = 500;

    constructor() {
        super('Error while connecting to a database.');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeError() {
        return [
            {
                message: this.reason,
                statusCode: this.statusCode
            }
        ]
    }
}

export { DatabaseConnectionError };