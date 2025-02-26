import { z } from 'zod';

const codeAdemeSchema = z.union([
  z.literal('BAR_TH_171'),
  z.literal('BAR_TH_172'),
  z.literal('BAR_TH_159'),
  z.literal('BAR_EN_101'),
  z.literal('BAR_EN_102'),
  z.literal('BAR_EN_103'),
]);

const docTypeSchema = z.union([
  z.literal('ATTESTATION_RGE'),
  z.literal('DEVIS'),
  z.literal('FACTURE'),
  z.literal('FICHE_TECHNIQUE'),
]);

const getOperationsRequestSchema = z.object({ projectId: z.string() });

const getOperationsResponseSchema = z.object({
  operations: z.array(
    z.object({
      id: z.string(),
      codeAdeme: codeAdemeSchema,
    })
  ),
});

const getDocumentsRequestSchema = z.object({
  companyId: z.string(),
  docType: docTypeSchema.optional(),
});
const getDocumentsResponseSchema = z.object({
  documents: z.array(
    z.object({
      id: z.string(),
      operationIds: z.array(z.string()),
      docType: z.string(),
      codeAdeme: z.string(),
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

export {
  codeAdemeSchema,
  docTypeSchema,
  getOperationsRequestSchema,
  getOperationsResponseSchema,
  getDocumentsRequestSchema,
  getDocumentsResponseSchema,
  setDocumentsForOperationRequestSchema,
  setDocumentsForOperationResponseSchema,
};
