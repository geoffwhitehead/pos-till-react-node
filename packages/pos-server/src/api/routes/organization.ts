import { Router, Request, Response, NextFunction } from 'express';
import { OrganizationService } from '../../services/organization';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { objectId } from '../../utils/objectId';

export default (app: Router) => {
    const route = Router();
    app.use('/organization', route);

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const organizationService = Container.get('organizationService') as OrganizationService;

        try {
            const organization = await organizationService.create(req.body);
            res.status(200).json({ success: true, data: organization })

        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const organizationService = Container.get('organizationService') as OrganizationService;
        console.log('asdasdkjahsfiuhaiuefnaebnfiuserbf');
        console.log('req.params', req.params);
        try {
            const organization = await organizationService.findByIdAndUpdate(objectId(req.params.id), req.body);
            res.status(200).json({ success: true, data: organization })

        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const organizationService = Container.get('organizationService') as OrganizationService;

        console.log('req.params', req.params);
        try {
            const organization = await organizationService.findById(objectId(req.params.id));
            res.status(200).json({ success: true, data: organization })

        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
