import jwt from 'jsonwebtoken';
import config from '../../config';
import Container from 'typedi';
import { AuthService } from '../../services/auth';
import { Logger } from 'winston';
import { access } from 'fs';

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
    console.log(' ---------- req.headers', req.headers);

    const { url, method } = req;

    console.log('**************');
    console.log('**************');
    console.log('url', url);
    console.log('method', method);
    const unprotectedRoutes = [
        { url: '/api/auth/signup', method: 'POST' },
        { url: '/api/auth/signin', method: 'POST' },
    ];

    const logger = Container.get('logger') as Logger;

    if (!unprotectedRoutes.some(route => route.url === url && route.method === method)) {
        const accessToken = getTokenFromHeader(req);
        console.log('------ accessToken', accessToken);
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
            const authService = Container.get('authService') as AuthService; // TODO: type

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

// const extendAuthorize = jwt({
//     secret: config.accessTokenSecret, // The _secret_ to sign the JWTs
//     userProperty: 'token', // Use req.token to store the JWT
//     getToken: getTokenFromHeader, // How to extract the JWT from the request
// });

export default extendAuthorize;
