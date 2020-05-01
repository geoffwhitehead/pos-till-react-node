import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import productRoutes from './product';
import maintenanceRoutes from './maintenance';
import printerRoutes from './printer';
import organizationRoutes from './organization';

export default () => {
    const app = Router();

    [userRoutes, authRoutes, productRoutes, maintenanceRoutes, printerRoutes, organizationRoutes].map(route =>
        route(app),
    );

    return app;
};
