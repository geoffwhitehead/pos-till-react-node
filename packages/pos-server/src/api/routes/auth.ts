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
import { Logger } from 'winston';

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
                const user = await authService.signUp(req.body);
                console.log('user', user);
                res.status(200).send(user);
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
                const user = await authService.signIn({ email, password });
                return res.json({ user }).status(200);
            } catch (err) {
                logger.error(`🔥 error: ${err}`);
                return next(err);
            }
        },
    );
};
