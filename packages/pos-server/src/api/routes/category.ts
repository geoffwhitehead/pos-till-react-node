import { Router, Request, Response, NextFunction } from 'express';
import { CategoryService } from '../../services/category';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';

// const router = Router();

// //Get all users
// router.get('/', CategoryController.getAll);

// // Get one user
// router.get('/:id', CategoryController.getById);

// //Create a new user
// router.post('/', CategoryController.create);

// //Edit one user
// router.put('/:id', CategoryController.update);

// //Delete one user
// router.delete('/:id', CategoryController.remove);

// export default router;

export default (app: Router) => {
    const route = Router();
    app.use('/categories', route);

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const categoryService = Container.get('categoryService') as CategoryService;

        logger.debug(`Calling create category endpoint with body: ${JSON.stringify(req.body)}`);

        try {
            const category = await categoryService.create(req.body);
            res.json({ category }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
