import { Router } from 'express';
import {
  createAssociation,
  deleteAssociation,
  getAssociation,
  listAssociations,
  updateAssociation,
} from '../controllers/associationController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listAssociations);
router.get('/:id', getAssociation);
router.post('/', requireAuth, requireRole('admin'), createAssociation);
router.put('/:id', requireAuth, updateAssociation);
router.delete('/:id', requireAuth, deleteAssociation);

export default router;
