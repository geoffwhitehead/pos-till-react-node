import { Container } from 'typedi';
import { Logger } from 'winston';
/**
 * Set tenant on Container
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachTenant = async (req, res, next) => {
    const logger = Container.get('logger') as Logger;
    console.log('req.token', req.token);

    if (!req.token) {
        return next();
    }
    try {
        Container.set('organizationId', req.token.organizationId);
        return next();
    } catch (e) {
        logger.error('🔥 Error attaching tenant id: %o', e);
        return next(e);
    }
};

export default attachTenant;
