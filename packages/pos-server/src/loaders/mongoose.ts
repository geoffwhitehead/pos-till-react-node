import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

export default async (): Promise<Db> => {
    console.log('********* config', config);
    console.log('port ', config.port);
    const connection = await mongoose.connect(config.databaseURL, { useNewUrlParser: true, useCreateIndex: true });
    return connection.connection.db;
};
