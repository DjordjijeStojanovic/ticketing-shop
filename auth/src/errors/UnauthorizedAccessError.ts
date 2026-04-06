import { CustomError } from "./customError";

class UnauthorizedAccessError extends CustomError {
    statusCode = 401;

    constructor() {
        super('');
        Object.setPrototypeOf(this, UnauthorizedAccessError.prototype);
    }

    serializeError() {
        return [
            { 
                message: 'Unauthorized'
            }
        ]
    }
}

export { UnauthorizedAccessError };