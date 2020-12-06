import { Request } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';
import { Logger } from 'winston';
import config from '../../config';
import { AuthService } from '../../services/auth';

export interface AuthorizedRequest extends Request {
    organizationId: string;
    userId: string;
}

export const getTokenFromHeader = req => {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const extendAuthorize = async (req, res, next) => {
    const { url, method } = req;

    const unprotectedRoutes = [
        { url: '/api/auth/signup', method: 'POST' },
        { url: '/api/auth/signin', method: 'POST' },
    ];

    const logger = Container.get('logger') as Logger;

    if (!unprotectedRoutes.some(route => route.url === url && route.method === method)) {
        const accessToken = getTokenFromHeader(req);
        if (!accessToken) {
            res.status(401).json('Unauthorized');
            return;
        }

        try {
            logger.debug('Verify access token');
            const { organizationId, userId } = jwt.verify(accessToken, config.accessTokenSecret);
            req.organizationId = organizationId;
            req.userId = userId;
            Container.set('organizationId', organizationId);
            Container.set('userId', userId);
        } catch (err) {
            logger.debug('Verifying refresh token');
            logger.debug(err);

            // access token expired or token err
            const authService = Container.get('authService') as AuthService;

            const refreshToken = req.headers['x-refresh-token'];
            const response = await authService.refreshTokens({ accessToken, refreshToken });

            if (response.success) {
                res.set('x-refresh-token', response.refreshToken);
                res.set('authorization', 'Bearer ' + response.accessToken);
            } else {
                res.status(401).json('Unauthorized');
                return;
            }

            req.organizationId = response.data.organizationId;
            req.userId = response.data._id;

            Container.set('organizationId', response.data.organizationId);
            Container.set('userId', response.data._id);
        }
    }
    next();
};

export default extendAuthorize;
