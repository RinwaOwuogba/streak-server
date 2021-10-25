import express from 'express';
import checkJwt from '../middlewares/checkJwt';
import streakRouter from './streak';
import goalRouter from './goal';

const router = express.Router();

// health check
router.get('/', (req, res) => res.send('ok'));

router.use(checkJwt);
router.use(goalRouter);
router.use(streakRouter);

export default router;
