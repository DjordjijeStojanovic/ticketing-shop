import { CustomError } from "./customError";

class RouteNotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('The requested route was not written yet.');
        Object.setPrototypeOf(this, RouteNotFoundError.prototype);
    }
    serializeError() {
        return [
            {
                message: 'The requested route does not exist'
            }
        ]
    }
}

export { RouteNotFoundError };