import { Router } from 'express';
import { createUser, readUsers, readUser, updateUser, deleteUser } from '../controllers/user';
const router = Router();

/* All the Users Route */
router
    .route('')
    .get(readUsers)
    .post(createUser);

/* Single User by Name Route */
router
    .route('/:name')
    .get(readUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;
