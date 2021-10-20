import { Express } from 'express';
import mongoose from 'mongoose';
import config from '../config';

const loader = async (app: Express) => {
  await mongoose.connect(config.DB_CONNECTION_STRING);
};

export default loader;
