import { Express } from 'express';
import mongoose from 'mongoose';
import config from '../config';

// replace _id with id in returned results
mongoose.plugin((schema) => {
  schema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret._id = undefined;
    },
  });
});

const loader = async (app: Express) => {
  await mongoose.connect(config.DB_CONNECTION_STRING);
};

export default loader;
