import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { objectId } from '../../utils/objectId';
import { PrinterGroupService } from '../../services/printerGroup';

export default (app: Router) => {
    const route = Router();
    app.use('/printer-groups', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerGroupService = Container.get('printerGroupService') as PrinterGroupService;

        try {
            const printerGroups = await printerGroupService.findAll();
            res.status(200).json({ success: true, data: printerGroups });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerGroupService = Container.get('printerGroupService') as PrinterGroupService;

        try {
            const printerGroup = await printerGroupService.create(req.body);
            res.status(200).json({ success: true, data: printerGroup });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerGroupService = Container.get('printerGroupService') as PrinterGroupService;

        try {
            const printerGroup = await printerGroupService.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ success: true, data: printerGroup });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const printerGroupService = Container.get('printerGroupService') as PrinterGroupService;

        try {
            const printerGroup = await printerGroupService.findById(req.params.id);
            res.status(200).json({ success: true, data: printerGroup });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
