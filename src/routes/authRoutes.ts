import { Router } from 'express';
import { getCsrfToken, login, logout, me, register } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);
router.get('/csrf-token', getCsrfToken);

export default router;
