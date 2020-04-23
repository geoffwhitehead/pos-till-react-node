import { Router } from 'express';
import categoryRoutes from './category';
import discountRoutes from './discount';
import itemRoutes from './item';
import modifierRoutes from './modifier';
import priceGroupRoutes from './priceGroup';

export default (app: Router) => {
    const router = Router();
    app.use('/product/', router);

    const routes = [categoryRoutes, discountRoutes, itemRoutes, modifierRoutes, priceGroupRoutes];

    routes.map(route => route(router));
};
