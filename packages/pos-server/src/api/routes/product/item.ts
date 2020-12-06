import { Router } from 'express';

export default (app: Router) => {
    const route = Router();
    app.use('/items', route);

    /**
     * TODO: Since refactoring the service layer these endpoints will need looking at. Mongo has been changed to be more
     * relational to reflect the sql data structure on the client.
     */

    // route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { item: itemService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling get item endpoint with body: ${JSON.stringify(req.body)}`);

    //     try {
    //         const items = await itemService.findAll();

    //         res.status(200).json({ success: true, data: items });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { item: itemService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling create item endpoint with body: ${JSON.stringify(req.body)}`);

    //     try {
    //         const item = await itemService.create(req.body);
    //         res.status(200).json({ success: true, data: item });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { item: itemService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling update item endpoint with params: ${req.params}, body: ${JSON.stringify(req.body)}`);

    //     try {
    //         const item = await itemService.findByIdAndUpdate(req.params.id, req.body);
    //         res.status(200).json({ success: true, data: item });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { item: itemService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling get item endpoint with params: ${req.params}`);

    //     try {
    //         const item = await itemService.findById(req.params.id);
    //         res.status(200).json({ success: true, data: item });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });
};
