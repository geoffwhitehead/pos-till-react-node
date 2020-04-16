import { Router } from 'express';
import { Test } from '../models/Test';
import { AuthRequest } from '../middlewares/extendAuthorize';
import { Response } from 'express';
import { getTenantId } from '../contexts';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    console.log('req.user', req.user);
    console.log('getTenantId', getTenantId());
    try {
        await Test({}).find();
        res.status(201).send('created item');
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;
