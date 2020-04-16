import { Router } from 'express';
import { Test } from '../models/Test';
import { AuthRequest } from '../middlewares/extendAuthorize';
import { Response } from 'express';
import { getTenantId } from '../contexts';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
    console.log('req.user', req.user);
    console.log('getTenantId', getTenantId());
    try {
        await Test({}).create({ name: 'test' });
        res.status(201).send('test get');
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;
