import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/RequestValidationError';
import { User } from '../models/user';
import { BadHTTPRequestError } from '../errors/BadHTTPRequestError';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Please provide a valid email.'),
    body('password').trim().isLength({ min: 4, max: 16 }).withMessage('Password must be between 4 ad 16 chars')
], async (req: Request, res: Response) => {
    const ifErrors = validationResult(req);

    if(!ifErrors.isEmpty()) {
        throw new RequestValidationError(ifErrors.array());
    }
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if(userExists) {
        throw new BadHTTPRequestError('User with that email already exists.');
    }

    const user = User.build({ email: email, password: password });
    await user.save();

    return res.status(201).json({ result: 'User succesfully created!', user: user });
});

export { router as signUpRouter };