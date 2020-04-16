import { Router } from 'express';
import * as ModifierController from '../controllers/modifier';

const router = Router();

//Get all users
router.get('/', ModifierController.getAll);

// Get one user
router.get('/:id', ModifierController.getById);

//Create a new user
router.post('/', ModifierController.create);

//Edit one user
router.put('/:id', ModifierController.update);

//Delete one user
router.delete('/:id', ModifierController.remove);

export default router;
