import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user';
import { objectId } from '../../utils/objectId';
import { LoggerService } from '../../loaders/logger';

export default (app: Router) => {
    const route = Router();
    app.use('/users', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const userService = Container.get('userService') as UserService;

        logger.debug(`Calling get user endpoint with body: ${req.body}`);

        try {
            const users = await userService.findAll();
            res.json({ users }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const userService = Container.get('userService') as UserService;

        logger.debug(`Calling create user endpoint with body: ${req.body}`);

        try {
            const user = await userService.create(req.body);
            res.json({ user }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const userService = Container.get('userService') as UserService;

        logger.debug(`Calling update user endpoint with params: ${req.params}, body: ${req.body}`);

        try {
            const user = await userService.findByIdAndUpdate(objectId(req.params.id), req.body);
            res.json({ user }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });

    route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const userService = Container.get('userService') as UserService;

        logger.debug(`Calling get user endpoint with params: ${JSON.stringify(req.params)}`);

        try {
            const user = await userService.findById(objectId(req.params.id));
            res.json({ user }).status(200);
        } catch (err) {
            logger.error(`🔥 error: ${err}`);
            return next(err);
        }
    });
};
