import { Router } from 'express';
import * as PriceGroupController from '../controllers/priceGroup';
import { checkJwt } from '../middlewares';

const router = Router();

router.get('/', [checkJwt], PriceGroupController.getAll);
router.get('/:id', [checkJwt], PriceGroupController.getById);
router.post('/', [checkJwt], PriceGroupController.create);
router.put('/:id', [checkJwt], PriceGroupController.update);

export default router;
