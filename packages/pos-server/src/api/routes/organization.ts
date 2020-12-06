import { NextFunction, Response, Router } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { OrganizationService } from '../../services/organization';
import { AuthorizedRequest } from '../middlewares/extendAuthorize';

export default (app: Router) => {
    const route = Router();
    app.use('/organization', route);

    /**
     * TODO: Since refactoring the service layer these endpoints will need looking at. Mongo has been changed to be more
     * relational to reflect the sql data structure on the client.
     */

    route.get('/', async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const organizationService = Container.get('organizationService') as OrganizationService;
        try {
            const organization = await organizationService.findById(req.organizationId);
            res.status(200).json({ success: true, data: organization });
        } catch (err) {
            logger.error(`error: ${err}`);
            return next(err);
        }
    });

    // route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const organizationService = Container.get('organizationService') as OrganizationService;

    //     try {
    //         const organization = await organizationService.create(req.params)
    //         res.status(200).json({ success: true, data: organization })

    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });

    route.put('/:id', async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const organizationService = Container.get('organizationService') as OrganizationService;
        try {
            const organization = await organizationService.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ success: true, data: organization });
        } catch (err) {
            logger.error(`error: ${err}`);
            return next(err);
        }
    });

    // route.get('/:id', async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    //     const logger = Container.get('logger') as LoggerService;
    //     const organizationService = Container.get('organizationService') as OrganizationService;

    //     console.log('req.params', req.params);
    //     try {
    //         const organization = await organizationService.findById(req.params.id);
    //         res.status(200).json({ success: true, data: organization })

    //     } catch (err) {
    //         logger.error(`🔥 error: ${err}`);
    //         return next(err);
    //     }
    // });
};
