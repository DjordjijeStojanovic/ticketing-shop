import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/RequestValidationError';
import { DatabaseConnectionError } from '../errors/DatabaseConnectionError';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Please provide a valid email.'),
    body('password').trim().isLength({ min: 4, max: 16 }).withMessage('Password must be between 4 ad 16 chars')
], (req: Request, res: Response) => {
    const ifErrors = validationResult(req);

    if(!ifErrors.isEmpty()) {
        throw new RequestValidationError(ifErrors.array());
    }
    const { email, password } = req.body;

    console.log('Creating a user!');
    throw new DatabaseConnectionError();

    res.json({ result: 'User creation route went through!'});
});

export { router as signUpRouter };