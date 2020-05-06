// import { Router } from 'express';
// import { login, changePassword } from '../../controllers/auth';
// import { create } from '../../controllers/user';

// const router = Router();

// router.route('/login').post(login);
// router.route('/register').post(create); // TODO: just route to user create until org structure in place
// router.route('/change-password').post(changePassword);

// export default router;

import { Container, ContainerInstance } from 'typedi';
import mongoose from 'mongoose';

import { Router, Request, Response, NextFunction } from 'express';
import { UserProps, CreateUserValidation } from '../../models/User';
import { AuthService } from '../../services/auth';
import { celebrate, Joi } from 'celebrate';
import { OrganizationValidation } from '../../models/Organization';
import { Logger, loggers } from 'winston';
import { getTokenFromHeader } from '../middlewares/extendAuthorize';

// import middlewares from '../middlewares';

export default (app: Router) => {
    const route = Router();
    app.use('/auth', route);

    route.post(
        '/signup',
        celebrate({
            body: Joi.object({ ...OrganizationValidation, ...CreateUserValidation }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger') as Logger;
            logger.debug('Calling Sign-Up endpoint with body: %o', req.body);

            try {
                const authService = Container.get('authService') as AuthService;
                const response = await authService.signUp(req.body);
                if (response.success) {
                    console.log('user', response);
                    res.set('authorization', 'Bearer ' + response.accessToken);
                    res.set('x-refresh-token', response.refreshToken);
                    res.status(200).send({ success: response.success, data: response.data });
                } else {
                    res.status(200).send({ success: response.success });
                }
            } catch (err) {
                logger.error(`🔥 error: ${err}`);
                return next(err);
            }
        },
    );

    route.post(
        '/signin',
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger') as Logger;
            logger.debug('Calling Sign-In endpoint with body: %o', req.body);
            try {
                const { email, password } = req.body;
                const authService = Container.get('authService') as AuthService;
                const response = await authService.signIn({ email, password });

                if (response.success) {
                    console.log('user', response);
                    res.set('authorization', 'Bearer ' + response.accessToken);
                    res.set('x-refresh-token', response.refreshToken);
                    res.status(200).send({ success: response.success, data: response.data });
                } else {
                    res.status(200).send({ success: response.success });
                }
            } catch (err) {
                logger.error(`🔥 error: ${err}`);
                return next(err);
            }
        },
    );

    route.put('/refresh-tokens', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as Logger;
        logger.debug('Calling refresh-tokens endpoint');
        try {
            const authService = Container.get('authService') as AuthService;
            const response = await authService.refreshTokens({
                accessToken: getTokenFromHeader(req),
                refreshToken: req.headers['x-refresh-token'] as string,
            });
            return res.json(response).status(200);
        } catch (err) {
            const logger = Container.get('logger') as Logger;
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
