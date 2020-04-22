import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import categoryRoutes from './category';

export default () => {
    const app = Router();

    const routes = [userRoutes, authRoutes, categoryRoutes];

    routes.map(route => route(app));

    return app;
};
