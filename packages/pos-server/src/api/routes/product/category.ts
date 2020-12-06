import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../../loaders/logger';
import { ProductService } from '../../../services/product';

export default (app: Router) => {
    const route = Router();
    app.use('/categories', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { category: categoryService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get categories endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const categories = await categoryService.findAll();
            res.status(200).json({ success: true, data: categories });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { category: categoryService } = Container.get('productService') as ProductService;

        logger.debug(`Calling create category endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const category = await categoryService.create(req.body);
            res.status(200).json({ success: true, data: category });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { category: categoryService } = Container.get('productService') as ProductService;

        logger.debug(`Calling update category endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const category = await categoryService.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ success: true, data: category });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { category: categoryService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get category endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const category = await categoryService.findById(req.params.id);
            res.status(200).json({ success: true, data: category });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
