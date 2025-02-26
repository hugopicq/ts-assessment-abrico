import { $Enums } from '@prisma/client';
import { beforeEach } from 'node:test';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { createCallerFactory } from '@/server/config/trpc';
import { appRouter } from '@/server/router';

import { caller, createTestTRPCContext, ctx } from '../trpc';

describe('[unit] getDocuments tRPC Handler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should query correctly without a filter', async (): Promise<void> => {
    const mockedDocuments = [
      {
        codeAdeme: 'BAR_EN_102' as $Enums.ECodeAdeme,
        docType: 'ATTESTATION_RGE' as $Enums.EDocType,
        companyId: 'aze',
        id: 'aze',
        operations: [],
      },
      {
        codeAdeme: 'BAR_EN_103' as $Enums.ECodeAdeme,
        docType: 'DEVIS' as $Enums.EDocType,
        companyId: 'aze',
        id: 'azeqsds',
        operations: [],
      },
    ];
    ctx.db.document.findMany.mockResolvedValue(mockedDocuments);

    const operations = await caller.operations.getDocuments({
      companyId: 'qsd',
    });

    expect(
      ctx.db.document.findMany.mock.calls[0]?.[0]?.where?.AND
    ).toHaveLength(1);
    expect(operations.documents).toHaveLength(2);
  });

  it('should query correctly with a filter', async (): Promise<void> => {
    const mockedDocuments = [
      {
        codeAdeme: 'BAR_EN_102' as $Enums.ECodeAdeme,
        docType: 'ATTESTATION_RGE' as $Enums.EDocType,
        companyId: 'aze',
        id: 'aze',
        operations: [],
      },
    ];
    ctx.db.document.findMany.mockResolvedValue(mockedDocuments);

    const operations = await caller.operations.getDocuments({
      companyId: 'qsd',
      docType: 'ATTESTATION_RGE',
    });

    expect(
      ctx.db.document.findMany?.mock?.calls?.[1]?.[0]?.where?.AND
    ).toHaveLength(2);
    expect(operations.documents).toHaveLength(1);
  });
});
