import { PrismaClient } from '@prisma/client';
import { Session, User } from 'lucia';
import pino from 'pino';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';

import { AppContext, createCallerFactory } from '@/server/config/trpc';
import { appRouter } from '@/server/router';

export const createCaller = createCallerFactory(appRouter);

export const createTestTRPCContext = (): Omit<AppContext, 'db'> & {
  db: DeepMockProxy<PrismaClient>;
} => {
  const session: Session = {
    id: 'toto',
    userId: 'toto',
    expiresAt: new Date(),
    fresh: true,
  };

  const user: User = {
    accountStatus: 'ENABLED',
    authorizations: ['APP'],
    id: 'toto',
    isEmailVerified: true,
    language: 'fr',
  };

  const apiType: 'REST' | 'TRPC' = 'TRPC';

  return {
    user,
    session,
    apiType,
    logger: pino(),
    db: mockDeep<PrismaClient>(),
  };
};

export const ctx = createTestTRPCContext();
export const caller = createCaller(ctx);
