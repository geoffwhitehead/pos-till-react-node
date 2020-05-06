import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { MaintenanceService } from '../../services/maintenance';

export default (app: Router) => {
    const route = Router();
    app.use('/maintenance', route);

    route.post('/seed', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const maintenanceService = Container.get('maintenanceService') as MaintenanceService;
        const organizationId = Container.get('organizationId') as string;

        logger.debug(`Seeding data for org: ${JSON.stringify(organizationId)}`);

        try {
            const response = await maintenanceService.seed();
            res.status(200).json(response);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
