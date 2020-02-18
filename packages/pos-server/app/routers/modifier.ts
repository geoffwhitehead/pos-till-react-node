import { Router } from 'express';
import * as ModifierController from '../controllers/modifier';
import { checkJwt } from '../middlewares';

const router = Router();

//Get all users
router.get('/', [checkJwt], ModifierController.getAll);

// Get one user
router.get('/:id', [checkJwt], ModifierController.getById);

//Create a new user
router.post('/', [checkJwt], ModifierController.create);

//Edit one user
router.put('/:id', [checkJwt], ModifierController.update);

//Delete one user
router.delete('/:id', [checkJwt], ModifierController.remove);

export default router;
