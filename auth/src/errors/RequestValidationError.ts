import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

class RequestValidationError extends CustomError {
    statusCode = 400;
    
    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeError() {
        return this.errors.map((error) => {
            if(error.type === 'field') {
                return { message: error.msg, field: error.path, statusCode: this.statusCode }
            }
        })
    }
}

export { RequestValidationError };