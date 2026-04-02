import { CustomError } from "./customError";

class BadHTTPRequestError extends CustomError {
    statusCode = 400;
    constructor(public reason: string) {
        super(reason);
        Object.setPrototypeOf(this, BadHTTPRequestError.prototype);
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

export { BadHTTPRequestError };