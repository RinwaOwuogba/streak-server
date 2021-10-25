import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import router from './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler);

export default app;
