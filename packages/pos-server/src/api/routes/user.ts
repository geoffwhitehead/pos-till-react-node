// import { Router } from 'express';
// // import * as UserController from '../controllers/user';

// const router = Router();

// //Get all users
// router.get('/', UserController.getAll);

// // Get one user
// router.get('/:id', UserController.getById);

// //Create a new user
// router.post('/', UserController.create);

// //Edit one user
// router.put('/:id', UserController.update);

// //Delete one user
// router.delete('/:id', UserController.remove);

// export default router;
import { Container, ContainerInstance } from 'typedi';
import mongoose from 'mongoose';

import { Router, Request, Response, NextFunction } from 'express';
import { UserProps } from '../../models/User';
import { UserService } from '../../services/userService';

// import middlewares from '../middlewares';

export default (app: Router) => {
    const route = Router();
    app.use('/users', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const userService = Container.get('userService') as UserService;
        const users = await userService.findAll();
        console.log('users', users);
        res.status(200).send(users);
    });

    // route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    //     return res.json({ user: req.currentUser }).status(200);
    // });
};
