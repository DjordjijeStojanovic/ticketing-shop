import { NextFunction, Request, Response } from "express";
import { UnauthorizedAccessError } from "../errors/UnauthorizedAccessError";

export const requireAuthToAccessRoutes = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser) {
        throw new UnauthorizedAccessError();
    }
    next();
}