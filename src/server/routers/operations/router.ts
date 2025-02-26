import { TRPCError } from '@trpc/server';
import { string, z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../../config/trpc';
import {
  getDocumentsRequestSchema,
  getDocumentsResponseSchema,
  getOperationsRequestSchema,
  getOperationsResponseSchema,
  setDocumentsForOperationRequestSchema,
  setDocumentsForOperationResponseSchema,
} from './schemas';

export const operationRouter = createTRPCRouter({
  getOperations: protectedProcedure()
    .meta({
      openapi: {
        method: 'GET',
        path: '/projects/{projectId}/operations',
      },
    })
    .input(getOperationsRequestSchema)
    .output(getOperationsResponseSchema)
    .query(async ({ ctx, input }) => {
      const operations = await ctx.db.operation.findMany({
        where: { projectId: { equals: input.projectId } },
      });
      return {
        operations: operations.map((op) => ({
          id: op.id,
          codeAdeme: op.codeAdeme,
        })),
      };
    }),
  getDocuments: protectedProcedure()
    .meta({
      openapi: {
        method: 'GET',
        path: '/companies/{companyId}/documents',
      },
    })
    .input(getDocumentsRequestSchema)
    .output(getDocumentsResponseSchema)
    .query(async ({ ctx, input }) => {
      const documents = await ctx.db.document.findMany({
        where: {
          AND: [
            { companyId: { equals: input.companyId } },
            ...(input.docType !== undefined
              ? [{ docType: { equals: input.docType } }]
              : []),
          ],
        },
        select: {
          id: true,
          codeAdeme: true,
          docType: true,
          operations: {
            select: {
              id: true,
            },
          },
        },
      });
      return {
        documents: documents.map((document) => ({
          id: document.id,
          operationIds: document.operations.map((op) => op.id),
          codeAdeme: document.codeAdeme,
          docType: document.docType,
        })),
      };
    }),
  setDocumentsForOperation: protectedProcedure()
    .meta({
      openapi: {
        method: 'PUT',
        path: '/operations/{operationId}/documents',
      },
    })
    .input(setDocumentsForOperationRequestSchema)
    .output(setDocumentsForOperationResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const dbOperation = await ctx.db.operation.findUnique({
        where: { id: input.operationId },
        select: { project: { select: { companyId: true } } },
      });

      //We should also check that the company for the operation is authorized for the user
      if (!dbOperation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Operation ID not found',
        });
      }

      const companyDocuments = await ctx.db.document.findMany({
        where: { companyId: { equals: dbOperation?.project.companyId } },
      });

      const companyDocumentIds = new Set(companyDocuments.map((doc) => doc.id));
      const inputDocumentIds = new Set(input.documentsId);

      if (inputDocumentIds.difference(companyDocumentIds).size > 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'You are trying to assign documents from another company which is forbidden',
        });
      }

      await ctx.db.operation.update({
        where: { id: input.operationId },
        data: {
          documents: {
            set: input.documentsId.map((docId) => ({ id: docId })),
          },
        },
      });

      return {
        success: true,
      };
    }),
});
