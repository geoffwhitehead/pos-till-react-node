import { Router } from 'express';

export default (app: Router) => {
    const route = Router();
    app.use('/modifiers', route);

    /**
     * TODO: Since refactoring the service layer these endpoints will need looking at. Mongo has been changed to be more
     * relational to reflect the sql data structure on the client.
     */

    // route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { modifier: modifierService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling get modifier endpoint with body: ${JSON.stringify(req.body)}`);

    //     try {
    //         const modifiers = await modifierService.findAll();
    //         res.status(200).json({ success: true, data: modifiers });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { modifier: modifierService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling create modifier endpoint with body: ${JSON.stringify(req.body)}`);

    //     try {
    //         const modifier = await modifierService.create(req.body);
    //         res.status(200).json({ success: true, data: modifier });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { modifier: modifierService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling update modifier endpoint with params: ${req.params}, body: ${JSON.stringify(req.body)}`);

    //     try {
    //         const modifier = await modifierService.findByIdAndUpdate(req.params.id, req.body);
    //         res.status(200).json({ success: true, data: modifier });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const { modifier: modifierService } = Container.get('productService') as ProductService;

    //     logger.debug(`Calling get modifier endpoint with params: ${req.params}`);

    //     try {
    //         const modifier = await modifierService.findById(req.params.id);
    //         res.status(200).json({ success: true, data: modifier });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });
};
