import { Router } from 'express';
import ensureAuthenticated from '../Middleware/Authentication';

// Import Routers
import authRouter from './auth';
import jobRouter from './job';

const router = Router();

// Setup Routes
router.use('/auth', authRouter);
router.use('/job', ensureAuthenticated, jobRouter);

export default router;
