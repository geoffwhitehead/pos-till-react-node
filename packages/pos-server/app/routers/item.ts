import { Router } from 'express';
import * as ItemController from '../controllers/item';
import { checkJwt } from '../middlewares';

const router = Router();

//Get all users
router.get('/', [checkJwt], ItemController.getAll);

// Get one user
router.get('/:id', [checkJwt], ItemController.getById);

//Create a new user
router.post('/', [checkJwt], ItemController.create);

//Edit one user
router.put('/:id', [checkJwt], ItemController.update);

//Delete one user
router.delete('/:id', [checkJwt], ItemController.remove);

export default router;
