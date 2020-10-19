import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../../loaders/logger';
import { ProductService } from '../../../services/product';
import { objectId } from '../../../utils/objectId';

export default (app: Router) => {
    const route = Router();
    app.use('/discounts', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { discount: discountService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get discounts endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const discounts = await discountService.findAll();
            res.status(200).json({ success: true, data: discounts });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { discount: discountService } = Container.get('productService') as ProductService;

        logger.debug(`Calling create discount endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const discount = await discountService.create(req.body);
            res.status(200).json({ success: true, data: discount });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { discount: discountService } = Container.get('productService') as ProductService;

        logger.debug(`Calling update discount endpoint with params: ${req.params}, body: ${JSON.stringify(req.body)}`);

        try {
            const discount = await discountService.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ success: true, data: discount });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { discount: discountService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get discount endpoint with params: ${req.params}`);

        try {
            const discount = await discountService.findById(req.params.id);
            res.status(200).json({ success: true, data: discount });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
