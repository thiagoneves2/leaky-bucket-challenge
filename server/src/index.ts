import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { publicRouter } from './routes/public';
import { protectedRouter } from './routes/protected';
import { authMiddleware } from './middleware/auth';
import { leakyBucketMiddleware } from './middleware/leakyBucket';
import { PORT, CORS_ORIGIN } from './config/env';

const app = new Koa();

// Global
app.use(bodyParser());
app.use(cors({ origin: CORS_ORIGIN }));

// Public Routes (pre-auth)
app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

// Auth + Rate limit 
app.use(authMiddleware);
app.use(leakyBucketMiddleware);

// Protected Routes
app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
