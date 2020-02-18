import { Router } from 'express';
import * as DiscountController from '../controllers/discount';
import { checkJwt } from '../middlewares';

const router = Router();

//Get all users
router.get('/', [checkJwt], DiscountController.getAll);

// Get one user
router.get('/:id', [checkJwt], DiscountController.getById);

//Create a new user
router.post('/', [checkJwt], DiscountController.create);

//Edit one user
router.put('/:id', [checkJwt], DiscountController.update);

//Delete one user
router.delete('/:id', [checkJwt], DiscountController.remove);

export default router;
