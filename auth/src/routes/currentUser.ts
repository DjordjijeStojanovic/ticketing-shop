import express, { Request, Response }  from 'express';
import { currentUser } from '../middlewares/currentUser';
const router = express.Router();

router.get('/api/users/me', currentUser, (req, res) => {
    res.json({ user: req.currentUser || null });
});

export { router as currentUserRouter };