import { ValidationError } from "express-validator";

class DatabaseConnectionError extends Error {
    reason = 'Error while connecting to a database.'
    constructor() {
        super();
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}

export { DatabaseConnectionError };