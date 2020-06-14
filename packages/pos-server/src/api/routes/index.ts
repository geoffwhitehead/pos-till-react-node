import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import productRoutes from './product';
import maintenanceRoutes from './maintenance';
import printerRoutes from './printer';
import organizationRoutes from './organization';
import printerGroupRoutes from "./printerGroup"

export default () => {
    const app = Router();

    [userRoutes, authRoutes, productRoutes, maintenanceRoutes, printerRoutes, organizationRoutes, printerGroupRoutes].map(route =>
        route(app),
    );

    return app;
};
