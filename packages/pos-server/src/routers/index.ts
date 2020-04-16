import { Router } from 'express';

import userRouter from './user';
import authRouter from './auth';
import categoryRouter from './category';
import discountRouter from './discount';
import itemRouter from './item';
import maintenanceRouter from './maintenance';
import modifierRouter from './modifier';
import priceGroupRouter from './priceGroup';
import organizationRouter from './organization';
import testRouter from './test';
const router = Router();

router.use('/test', testRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/discounts', discountRouter);
router.use('/items', itemRouter);
router.use('/maintenance', maintenanceRouter);
router.use('/modifiers', modifierRouter);
router.use('/price-group', priceGroupRouter);
router.use('/organization', organizationRouter);

export default router;
