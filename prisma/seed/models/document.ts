//We create a user with a company with 2/3 documents
//We create a project in the company with an operation
import { prisma } from '../utils';

export async function createDocuments() {
  console.log(`⏳ Seeding necesary elements for documents`);
  const companyId = 'company1';
  const projectId = 'project1';

  if (!(await prisma.company.findUnique({ where: { id: companyId } }))) {
    await prisma.company.create({
      data: {
        id: companyId,
      },
    });
  }

  if (
    (await prisma.document.count({ where: { companyId: companyId } })) === 0
  ) {
    await prisma.document.createMany({
      data: [
        {
          id: 'doc1',
          companyId: companyId,
          codeAdeme: 'BAR_EN_101',
          docType: 'ATTESTATION_RGE',
        },
        {
          id: 'doc2',
          companyId: companyId,
          codeAdeme: 'BAR_EN_102',
          docType: 'ATTESTATION_RGE',
        },
        {
          id: 'doc3',
          companyId: companyId,
          codeAdeme: 'BAR_TH_159',
          docType: 'ATTESTATION_RGE',
        },
        {
          id: 'doc4',
          companyId: companyId,
          codeAdeme: 'BAR_EN_101',
          docType: 'DEVIS',
        },
        {
          id: 'doc5',
          companyId: companyId,
          codeAdeme: 'BAR_TH_172',
          docType: 'FACTURE',
        },
      ],
    });
  }

  if (!(await prisma.project.findUnique({ where: { id: projectId } }))) {
    await prisma.project.create({
      data: {
        id: projectId,
        companyId: companyId,
      },
    });
  }

  if (
    (await prisma.operation.count({ where: { projectId: projectId } })) === 0
  ) {
    await prisma.operation.createMany({
      data: [
        {
          id: 'op1',
          projectId: projectId,
          codeAdeme: 'BAR_EN_101',
        },
        {
          id: 'op2',
          projectId: projectId,
          codeAdeme: 'BAR_EN_102',
        },
        {
          id: 'op3',
          projectId: projectId,
          codeAdeme: 'BAR_TH_172',
        },
      ],
    });
  }
  console.log(`✅ Seeded necesary elements for documents`);
}
