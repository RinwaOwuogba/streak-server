import express from 'express';
import checkJwt from './middlewares/checkJwt';
import streakRouter from './streak';

const router = express.Router();

// health check
router.get('/', (req, res) => res.send('ok'));

router.use(checkJwt);
router.use(streakRouter);

export default router;
