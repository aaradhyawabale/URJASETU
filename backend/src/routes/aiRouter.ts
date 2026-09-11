import { Router } from 'express';
import { postAIReview } from '../controllers/aiController.js';

export const aiRouter = Router();

aiRouter.post('/ai/review', postAIReview);
