import { Router } from 'express';
import * as CategoryController from '../controllers/category';

const router = Router();

//Get all users
router.get('/', CategoryController.getAll);

// Get one user
router.get('/:id', CategoryController.getById);

//Create a new user
router.post('/', CategoryController.create);

//Edit one user
router.put('/:id', CategoryController.update);

//Delete one user
router.delete('/:id', CategoryController.remove);

export default router;
