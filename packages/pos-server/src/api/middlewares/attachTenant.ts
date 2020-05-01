import { Container } from 'typedi';
import { Logger } from 'winston';
import { OrganizationService } from '../../services/organization';
import { objectId } from '../../utils/objectId';
/**
 * Set tenant on Container
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachTenant = async (req, res, next) => {
    const logger = Container.get('logger') as Logger;
    const organizationService = Container.get('organizationService') as OrganizationService;

    logger.debug('req.token', req.token);

    if (!req.token) {
        return next();
    }
    try {
        const organization = await organizationService.findById(objectId(req.token.organizationId));
        console.log('org', organization);
        if (!organization) {
            res.status(400).json({
                error: { message: 'Organization not found when attaching tenant', code: 'NOT_FOUND' },
            });
            return;
        }
        Container.set('organizationId', req.token.organizationId);
        return next();
    } catch (e) {
        logger.error('🔥 Error attaching tenant id: %o', e);
        return next(e);
    }
};

export default attachTenant;
