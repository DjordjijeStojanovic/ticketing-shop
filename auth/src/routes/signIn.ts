import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '@djordjestojanovic/common';
import { validateRequest } from '@djordjestojanovic/common';
import { User } from '../models/user';
import { BadHTTPRequestError } from '@djordjestojanovic/common';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').trim().notEmpty().withMessage('Please provide a valid password!')
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        throw new BadHTTPRequestError('Incorrect login credentials.');
    }

    const passwordMatch = await Password.comparePass(user.password, password);    
    if(!passwordMatch) {
        throw new BadHTTPRequestError('Incorrect login credentials.');
    }
    
    const userJwt = jwt.sign({
        id: user._id,
        emai: user.email,
    }, process.env.jwt_key);

    req.session = { jwt: userJwt };

    res.status(200).json({ loginSuccess: true });
});

export { router as signInRouter };