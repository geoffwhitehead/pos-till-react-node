import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../../loaders/logger';
import { ProductService } from '../../../services/product';
import { objectId } from '../../../utils/objectId';

export default (app: Router) => {
    const route = Router();
    app.use('/price-groups', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { priceGroup: priceGroupService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get priceGroup endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const priceGroups = await priceGroupService.findAll();
            res.json({ priceGroups }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { priceGroup: priceGroupService } = Container.get('productService') as ProductService;

        logger.debug(`Calling create priceGroup endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const priceGroup = await priceGroupService.create(req.body);
            res.json({ priceGroup }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { priceGroup: priceGroupService } = Container.get('productService') as ProductService;

        logger.debug(
            `Calling update priceGroup endpoint with params: ${req.params}, body: ${JSON.stringify(req.body)}`,
        );

        try {
            const priceGroup = await priceGroupService.findByIdAndUpdate(objectId(req.params.id), req.body);
            res.json({ priceGroup }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { priceGroup: priceGroupService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get priceGroup endpoint with params: ${req.params}`);

        try {
            const priceGroup = await priceGroupService.findById(objectId(req.params.id));
            res.json({ priceGroup }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
