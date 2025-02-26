import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../config/trpc';

const getOperationsRequestSchema = z.object({ projectId: z.string() });

const getOperationsResponseSchema = z.object({
  operations: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

const getDocumentsRequestSchema = z.object({ companyId: z.string() });
const getDocumentsResponseSchema = z.object({
  documents: z.array(
    z.object({
      id: z.string(),
      operationIds: z.array(z.string()),
    })
  ),
});

const setDocumentsForOperationRequestSchema = z.object({
  operationId: z.string(),
  documentsId: z.array(z.string()),
});

const setDocumentsForOperationResponseSchema = z.object({
  success: z.boolean(),
});

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
        operations: operations.map((op) => ({ id: op.id })),
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
        where: { companyId: { equals: input.companyId } },
        select: {
          id: true,
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

      //We should check that the company for the operation is authorized for the user

      const companyDocuments = await ctx.db.document.findMany({
        where: { companyId: { equals: dbOperation?.project.companyId } },
      });
      const companyDocumentIds = companyDocuments.map((doc) => doc.id);

      //n2 loop but acceptable given the number of data we are processing
      if (
        input.documentsId.some((docId) => !companyDocumentIds.includes(docId))
      ) {
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
