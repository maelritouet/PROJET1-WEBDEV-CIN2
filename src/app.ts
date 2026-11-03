import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import associationRoutes from './routes/associationRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import { csrfCookieSession, requireCsrfToken } from './middleware/csrf';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json());

app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'strict', secure: true },
    store: MongoStore.create({ mongoUrl: env.mongodbUri }),
  })
);

app.use(csrfCookieSession);
app.use(requireCsrfToken);
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/associations', associationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({ message: err.message || 'Erreur interne.' });
});
