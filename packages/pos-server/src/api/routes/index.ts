import { Router } from 'express';
import authRoutes from './auth';
import maintenanceRoutes from './maintenance';
import organizationRoutes from './organization';
import syncRoutes from './sync';
import userRoutes from './user';

export default () => {
    const app = Router();

    [userRoutes, authRoutes, maintenanceRoutes, organizationRoutes, syncRoutes].map(route => route(app));

    return app;
};
