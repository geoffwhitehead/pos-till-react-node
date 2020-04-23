import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import productRoutes from './product';
import maintenanceRoutes from './maintenance';

export default () => {
    const app = Router();

    const routes = [userRoutes, authRoutes, productRoutes, maintenanceRoutes];

    routes.map(route => route(app));

    return app;
};
