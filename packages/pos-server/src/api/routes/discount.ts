import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { ProductService } from '../../services/product';

export default (app: Router) => {
    const route = Router();
    app.use('/discounts', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { discount: discountService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get discounts endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const discounts = await discountService.findAll();
            res.json({ discounts }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
