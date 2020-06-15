import { AuthorizedRequest } from './extendAuthorize';
import Container from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { OrganizationService } from '../../services/organization';
import { objectId } from '../../utils/objectId';
import  uuid from 'uuid';

export const sync = async (req: AuthorizedRequest, res, next) => {
    // hack - use until sync is fully setup
    const { method, organizationId } = req;

    const methods = ['PUT', 'POST', 'PATCH', 'DELETE'];
    if (methods.includes(method) && organizationId) {
        const logger = Container.get('logger') as LoggerService;
        const organizationService = Container.get('organizationService') as OrganizationService;

        try {
            await organizationService.findByIdAndUpdate(objectId(organizationId), { syncId: uuid() });
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    }
    next();
};
