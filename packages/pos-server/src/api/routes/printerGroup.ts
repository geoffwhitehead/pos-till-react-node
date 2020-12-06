import { Router } from 'express';

export default (app: Router) => {
    const route = Router();
    app.use('/printer-groups', route);

    /**
     * TODO: Since refactoring the service layer these endpoints will need looking at. Mongo has been changed to be more
     * relational to reflect the sql data structure on the client.
     * TODO: fix all of this. Printer groups are now nested in printer service
     */

    // route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const printerService = Container.get('printerService') as PrinterService;

    //     try {
    //         const printerGroups = await printerService.findAll();
    //         res.status(200).json({ success: true, data: printerGroups });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const printerService = Container.get('printerService') as PrinterService;

    //     try {
    //         const printerGroup = await printerService.create(req.body);
    //         res.status(200).json({ success: true, data: printerGroup });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const printerService = Container.get('printerService') as PrinterService;

    //     try {
    //         const printerGroup = await printerService.findByIdAndUpdate(req.params.id, req.body);
    //         res.status(200).json({ success: true, data: printerGroup });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    // route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const printerService = Container.get('printerService') as PrinterService;

    //     try {
    //         const printerGroup = await printerService.findById(req.params.id);
    //         res.status(200).json({ success: true, data: printerGroup });
    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });
};
