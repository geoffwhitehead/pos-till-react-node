import { Router } from 'express';
import * as MaintenanceController from '../controllers/maintenance';
import { checkJwt } from '../middlewares';

const router = Router();

router.post('/seed', [checkJwt], MaintenanceController.seed);

export default router;
