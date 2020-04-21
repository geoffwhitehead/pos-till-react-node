import { Router } from 'express';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

export default () => {
    const app = Router();
    userRoutes(app);
    authRoutes(app);
    return app;
};
