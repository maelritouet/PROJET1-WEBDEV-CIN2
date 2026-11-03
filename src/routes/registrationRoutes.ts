import { Router } from 'express';
import {
  cancelRegistration,
  createRegistration,
  deleteRegistration,
  getRegistration,
  listRegistrations,
} from '../controllers/registrationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.post('/', createRegistration);
router.get('/', listRegistrations);
router.get('/:id', getRegistration);
router.patch('/:id/cancel', cancelRegistration);
router.delete('/:id', deleteRegistration);

export default router;
