import { Router } from 'express';
import * as UserController from '../controllers/user';

const router = Router();

//Get all users
router.get('/', UserController.getAll);

// Get one user
router.get('/:id', UserController.getById);

//Create a new user
router.post('/', UserController.create);

//Edit one user
router.put('/:id', UserController.update);

//Delete one user
router.delete('/:id', UserController.remove);

export default router;
