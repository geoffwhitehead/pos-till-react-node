import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../../loaders/logger';
import { ProductService } from '../../../services/product';
import { objectId } from '../../../utils/objectId';

export default (app: Router) => {
    const route = Router();
    app.use('/items', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { item: itemService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get item endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const items = await itemService.findAll();
            res.json({ items }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { item: itemService } = Container.get('productService') as ProductService;

        logger.debug(`Calling create item endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const item = await itemService.create(req.body);
            res.json({ item }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { item: itemService } = Container.get('productService') as ProductService;

        logger.debug(`Calling update item endpoint with params: ${req.params}, body: ${JSON.stringify(req.body)}`);

        try {
            const item = await itemService.findByIdAndUpdate(objectId(req.params.id), req.body);
            res.json({ item }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { item: itemService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get item endpoint with params: ${req.params}`);

        try {
            const item = await itemService.findById(objectId(req.params.id));
            res.json({ item }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
