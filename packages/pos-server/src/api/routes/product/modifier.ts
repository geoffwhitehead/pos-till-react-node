import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../../loaders/logger';
import { ProductService } from '../../../services/product';
import { objectId } from '../../../utils/objectId';

export default (app: Router) => {
    const route = Router();
    app.use('/modifiers', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { modifier: modifierService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get modifier endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const modifiers = await modifierService.findAll();
            res.json({ modifiers }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { modifier: modifierService } = Container.get('productService') as ProductService;

        logger.debug(`Calling create modifier endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const modifier = await modifierService.create(req.body);
            res.json({ modifier }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { modifier: modifierService } = Container.get('productService') as ProductService;

        logger.debug(`Calling update modifier endpoint with params: ${req.params}, body: ${JSON.stringify(req.body)}`);

        try {
            const modifier = await modifierService.findByIdAndUpdate(objectId(req.params.id), req.body);
            res.json({ modifier }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { modifier: modifierService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get modifier endpoint with params: ${req.params}`);

        try {
            const modifier = await modifierService.findById(objectId(req.params.id));
            res.json({ modifier }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
