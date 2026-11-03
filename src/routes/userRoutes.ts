import { Router } from 'express';
import { createUser, deleteUser, getUser, listUsers, updateUser } from '../controllers/userController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.post('/', createUser);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
