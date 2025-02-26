import { $Enums, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { afterEach, beforeEach } from 'node:test';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { createCallerFactory } from '@/server/config/trpc';
import { appRouter } from '@/server/router';

import { caller, createTestTRPCContext, ctx } from '../trpc';

describe('[unit] setDocumentsForOperation tRPC Handler', () => {
  const companyId = 'company1';
  const operation = {
    id: 'toto1',
    codeAdeme: 'BAR_EN_101' as $Enums.ECodeAdeme,
    project: { companyId },
    projectId: 'aze',
  };

  const documents = [
    {
      codeAdeme: 'BAR_EN_102' as $Enums.ECodeAdeme,
      docType: 'ATTESTATION_RGE' as $Enums.EDocType,
      companyId,
      id: 'doc1',
    },
    {
      codeAdeme: 'BAR_EN_102' as $Enums.ECodeAdeme,
      docType: 'DEVIS' as $Enums.EDocType,
      companyId,
      id: 'doc2',
    },
    {
      codeAdeme: 'BAR_EN_103' as $Enums.ECodeAdeme,
      docType: 'ATTESTATION_RGE' as $Enums.EDocType,
      companyId,
      id: 'doc3',
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    ctx.db.operation.findUnique.mockReset();
    ctx.db.document.findMany.mockReset();
    ctx.db.operation.update.mockReset();
  });

  it('should work if everything is ok', async (): Promise<void> => {
    ctx.db.operation.findUnique.mockResolvedValue(operation);
    ctx.db.document.findMany.mockResolvedValue(documents);

    const response = await caller.operations.setDocumentsForOperation({
      operationId: 'id',
      documentsId: ['doc1', 'doc2'],
    });

    expect(response.success).toBeTruthy();
  });

  it('should throw if operation not found', async (): Promise<void> => {
    ctx.db.operation.findUnique.mockResolvedValue(null);

    await expect(
      caller.operations.setDocumentsForOperation({
        operationId: 'id',
        documentsId: ['doc1', 'doc2'],
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should throw if we try to assign a document not found', async (): Promise<void> => {
    ctx.db.operation.findUnique.mockResolvedValue(operation);
    ctx.db.document.findMany.mockResolvedValue(documents);

    await expect(
      caller.operations.setDocumentsForOperation({
        operationId: 'id',
        documentsId: ['doc1', 'doc4'],
      })
    ).rejects.toThrow(TRPCError);
  });
});
