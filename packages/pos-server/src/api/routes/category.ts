import { Router, Request, Response, NextFunction } from 'express';
import { ProductService } from '../../services/product';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';

export default (app: Router) => {
    const route = Router();
    app.use('/categories', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { category: categoryService } = Container.get('productService') as ProductService;

        logger.debug(`Calling get categories endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const categories = await categoryService.findAll();
            res.json({ categories }).status(200);
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
            res.json({ category }).status(200);
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
            res.json({ category }).status(200);
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
            const category = await categoryService.findOne(req.body);
            res.json({ category }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
