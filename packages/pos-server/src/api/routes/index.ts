import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import productRoutes from './product';
import maintenanceRoutes from './maintenance';
import printerRoutes from './printer';

export default () => {
    const app = Router();

    [userRoutes, authRoutes, productRoutes, maintenanceRoutes, printerRoutes].map(route => route(app));

    return app;
};
