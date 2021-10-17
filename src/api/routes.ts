import express from 'express';

const router = express.Router();

// health check
router.get('/', (req, res) => res.send('ok'));

export default router;
