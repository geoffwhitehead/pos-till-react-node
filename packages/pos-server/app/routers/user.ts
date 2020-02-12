import { Router } from 'express';
import * as UserController from '../controllers/user';
import { checkJwt } from '../middlewares';

const router = Router();

//Get all users
router.get('/', [checkJwt], UserController.getAll);

// Get one user
router.get('/:id', [checkJwt], UserController.getById);

//Create a new user
router.post('/', [checkJwt], UserController.create);

//Edit one user
router.patch('/:id', [checkJwt], UserController.update);

//Delete one user
router.delete('/:id', [checkJwt], UserController.remove);

export default router;
