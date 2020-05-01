import mongoose from 'mongoose';

export const objectId = id => new mongoose.Types.ObjectId(id);

export type ObjectId = mongoose.Types.ObjectId;
