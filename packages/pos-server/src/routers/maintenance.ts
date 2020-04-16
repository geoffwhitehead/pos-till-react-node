import { Router } from 'express';
import * as MaintenanceController from '../controllers/maintenance';

const router = Router();

router.post('/seed', MaintenanceController.seed);

export default router;
