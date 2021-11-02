import express from 'express';
import checkJwt from '../middlewares/checkJwt';
import goalRouter from './goal';
import logEntryRouter from './logEntry';

const router = express.Router();

// health check
router.get('/', (req, res) => res.send('ok'));

router.use(checkJwt);
router.use(goalRouter);
router.use(logEntryRouter);

export default router;
