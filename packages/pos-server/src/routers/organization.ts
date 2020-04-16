import { Router } from 'express';
import * as OrganizationController from '../controllers/organization';

const router = Router();

router.get('/', OrganizationController.getAll);
router.get('/:id', OrganizationController.getById);
router.post('/', OrganizationController.create);
router.put('/:id', OrganizationController.update);

export default router;
