import { Router } from 'express';
import * as CategoryController from '../controllers/category';
import { checkJwt } from '../middlewares';

const router = Router();

//Get all users
router.get('/', [checkJwt], CategoryController.getAll);

// Get one user
router.get('/:id', [checkJwt], CategoryController.getById);

//Create a new user
router.post('/', [checkJwt], CategoryController.create);

//Edit one user
router.put('/:id', [checkJwt], CategoryController.update);

//Delete one user
router.delete('/:id', [checkJwt], CategoryController.remove);

export default router;
