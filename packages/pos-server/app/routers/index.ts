import { Router } from 'express';

import userRouter from './user';
import authRouter from './auth';
import categoryRouter from './category';
import discountRouter from './discount';
import itemRouter from './item';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/discounts', discountRouter);
router.use('/items', itemRouter);

export default router;
