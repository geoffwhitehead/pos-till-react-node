import { Router, Request, Response, NextFunction } from 'express';
import { PrinterService } from '../../services/printer';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { objectId } from '../../utils/objectId';

export default (app: Router) => {
    const route = Router();
    app.use('/printers', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerService = Container.get('printerService') as PrinterService;

        try {
            const printers = await printerService.findAll();
            res.status(200).json({ success: true, data: printers });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerService = Container.get('printerService') as PrinterService;

        try {
            const printer = await printerService.create(req.body);
            res.status(200).json({ success: true, data: printer });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerService = Container.get('printerService') as PrinterService;

        try {
            const printer = await printerService.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ success: true, data: printer });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerService = Container.get('printerService') as PrinterService;

        try {
            const printer = await printerService.findById(req.params.id);
            res.status(200).json({ success: true, data: printer });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
