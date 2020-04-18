import { Router } from 'express';
import userRoutes from './routes/user';

export default () => {
    const app = Router();
    userRoutes(app);
    return app;
};
