import { Router, Request, Response, NextFunction } from 'express';
import { PrinterService } from '../../services/printer';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { ProductService } from '../../services/product';

export default (app: Router) => {
    const route = Router();
    app.use('/sync', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const {
            item: itemService,
            modifier: modifierService,
            category: categoryService,
            discount: discountService,
            priceGroup: priceGroupService,
        } = Container.get('productService') as ProductService;

        const { lastPulledAt } = req.query;

        const [itemChanges, modifierChanges, categoryChanges, discountChanges, priceGroupChanges] = await Promise.all([
            itemService.pullChanges(lastPulledAt),
            modifierService.pullChanges(lastPulledAt),
            categoryService.pullChanges(lastPulledAt),
            discountService.pullChanges(lastPulledAt),
            priceGroupService.pullChanges(lastPulledAt),
        ]);

        const changes = {
            ...itemChanges,
            ...modifierChanges,
            ...categoryChanges,
            ...discountChanges,
            ...priceGroupChanges,
        };

        return res.status(200).json(changes);
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {});
};
