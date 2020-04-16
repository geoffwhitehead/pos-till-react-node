import { Router } from 'express';
import * as ItemController from '../controllers/item';

const router = Router();

//Get all users
router.get('/', ItemController.getAll);

// Get one user
router.get('/:id', ItemController.getById);

//Create a new user
router.post('/', ItemController.create);

//Edit one user
router.put('/:id', ItemController.update);

//Delete one user
router.delete('/:id', ItemController.remove);

export default router;
