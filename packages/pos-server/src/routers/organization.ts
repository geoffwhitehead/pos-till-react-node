import { Router } from 'express';
import * as OrganizationController from '../controllers/organization';
import { checkJwt } from '../middlewares';

const router = Router();

router.get('/', [checkJwt], OrganizationController.getAll);
router.get('/:id', [checkJwt], OrganizationController.getById);
router.post('/', OrganizationController.create);
router.put('/:id', [checkJwt], OrganizationController.update);

export default router;
