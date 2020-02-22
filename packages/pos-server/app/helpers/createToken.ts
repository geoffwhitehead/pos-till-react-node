import * as jwt from 'jsonwebtoken';
import config from '../../config/config';

export const createToken = (userId, email) => jwt.sign({ userId, email }, config.jwtSecret);
