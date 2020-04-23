import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import productRoutes from './product';

export default () => {
    const app = Router();

    const routes = [userRoutes, authRoutes, productRoutes];

    routes.map(route => route(app));

    return app;
};
