import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { OrganizationService } from '../../services/organization';
import { PrinterService } from '../../services/printer';
import { ProductService } from '../../services/product';

export default (app: Router) => {
    const route = Router();
    app.use('/maintenance', route);

    route.post('/seed', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;

        const organizationService = Container.get('organizationService') as OrganizationService;
        const printerService = Container.get('printerService') as PrinterService;
        const productService = Container.get('productService') as ProductService;

        const organizationId = Container.get('organizationId') as string;

        logger.debug(`Seeding data for org: ${JSON.stringify(organizationId)}`);

        try {
            await organizationService.seed();

            const [{ printerGroups }, { categories }, _, { priceGroups }] = await Promise.all([
                printerService.seed(),
                productService.category.seed(),
                productService.discount.seed(),
                productService.priceGroup.seed(),
            ]);
            const { modifiers } = await productService.modifier.seed({ priceGroups });

            await productService.item.seed({
                itemsToSeed: 75,
                priceGroups,
                categories,
                modifiers,
                printerGroups,
            });

            res.status(200).json({
                success: true,
            });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
