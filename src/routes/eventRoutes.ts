import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/eventController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', requireAuth, createEvent);
router.put('/:id', requireAuth, updateEvent);
router.delete('/:id', requireAuth, deleteEvent);

export default router;
