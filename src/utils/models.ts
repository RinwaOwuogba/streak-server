import { Schema } from 'mongoose';

export const requiredString = {
  type: String,
  required: true,
};

export const requiredObjectId = {
  type: Schema.Types.ObjectId,
  required: true,
};
