import { Router } from 'express';
import * as PriceGroupController from '../../controllers/priceGroup';

const router = Router();

router.get('/', PriceGroupController.getAll);
router.get('/:id', PriceGroupController.getById);
router.post('/', PriceGroupController.create);
router.put('/:id', PriceGroupController.update);

export default router;
