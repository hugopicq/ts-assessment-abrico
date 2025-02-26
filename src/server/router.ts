import { createTRPCRouter } from '@/server/config/trpc';
import { authRouter } from '@/server/routers/auth';

import { operationRouter } from './routers/operations/router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /src/server/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  operations: operationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
