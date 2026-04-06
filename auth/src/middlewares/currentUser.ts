import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserJWTPayload {
    id: string,
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserJWTPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session?.jwt) {
        return next();
    }
    try {
        const jwtDecoded = jwt.verify(req.session.jwt, process.env.jwt_key) as UserJWTPayload;
        req.currentUser = jwtDecoded;
    } catch (error) {
        console.error(error);
    }
    next();
}