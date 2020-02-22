import { Router } from 'express';
import { login, changePassword } from '../controllers/auth';
import { create } from '../controllers/user';
import { checkJwt } from '../middlewares';

const router = Router();

router.route('/login').post(login);
router.route('/register').post(create); // TODO: just route to user create until org structure in place
router.route('/change-password').post(changePassword, [checkJwt]);

export default router;
