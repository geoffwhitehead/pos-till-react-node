import { Router } from 'express';
import * as DiscountController from '../controllers/discount';

const router = Router();

//Get all users
router.get('/', DiscountController.getAll);

// Get one user
router.get('/:id', DiscountController.getById);

//Create a new user
router.post('/', DiscountController.create);

//Edit one user
router.put('/:id', DiscountController.update);

//Delete one user
router.delete('/:id', DiscountController.remove);

export default router;
