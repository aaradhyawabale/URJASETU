import express from 'express';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedRunner.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { healthRouter } from './routes/healthRouter.js';
import { sitesRouter } from './routes/sitesRouter.js';
import { proposalsRouter } from './routes/proposalsRouter.js';
import { aiRouter } from './routes/aiRouter.js';

const app = express();

app.use(express.json());
app.use(corsMiddleware);

// Connect to Database asynchronously on server boot
connectDB().then((connected) => {
  if (connected) {
    seedDatabase();
  }
});

// Mount Health Route
app.use('/api', healthRouter);

// Mount Versioned API Routes
app.use('/api/v1', sitesRouter);
app.use('/api/v1', proposalsRouter);
app.use('/api/v1', aiRouter);

// Centralized Error Handling
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`[UrjaSetu Backend] Listening on port ${env.PORT} in ${env.NODE_ENV} mode.`);
});

export default app;
