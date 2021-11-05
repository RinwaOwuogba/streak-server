import express from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import errorHandler from './middlewares/errorHandler';
import router from './routes';
import config from '../config';

const app = express();

app.use(helmet());

const corsOptions: CorsOptions = {
  origin: config.clientOriginUrl,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler);

export default app;
