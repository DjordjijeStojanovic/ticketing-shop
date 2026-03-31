import express from 'express';

const router = express.Router();

router.get('/api/users/me', (req, res) => {
    res.json({ status: "Working" });
});

export { router as currentUserRouter };