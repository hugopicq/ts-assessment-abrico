'use client';

import { Suspense, useEffect, useState } from 'react';

import { Spinner, Table } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { toastCustom } from '@/components/Toast';
import { BreadcrumbLink, BreadcrumbRoot } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PageHome from '@/features/app-home/PageHome';
import { AppLayoutPage } from '@/features/app/AppLayoutPage';
import { trpc } from '@/lib/trpc/client';

export default function Page() {
  const params = useParams();

  const companyId = params?.companyId?.toString() ?? '';
  const operationId = params?.operationId?.toString() ?? '';

  const { isLoading, error, data } = trpc.operations.getDocuments.useQuery({
    companyId,
    docType: 'ATTESTATION_RGE',
  });
  const saveDocuments = trpc.operations.setDocumentsForOperation.useMutation();

  const [assignedDocumentIds, setAssignedDocumentIds] = useState<Set<string>>(
    new Set()
  );

  const { t } = useTranslation(['auth']);

  useEffect(() => {
    if (data?.documents !== undefined) {
      setAssignedDocumentIds(
        new Set(
          data.documents
            .filter((doc) => doc.operationIds.includes(operationId))
            .map((doc) => doc.id)
        )
      );
    }
  }, [data]);

  const handleSave = () => {
    saveDocuments.mutate({
      operationId: operationId,
      documentsId: Array.from(assignedDocumentIds),
    });
  };

  const toggleDocument = (id: string) => {
    setAssignedDocumentIds((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
  };

  return (
    <Suspense>
      <AppLayoutPage>
        <BreadcrumbRoot>
          <BreadcrumbLink href="/app">Application</BreadcrumbLink>
          <BreadcrumbLink href="/app/company/company1/project/project1/operations">
            Operations
          </BreadcrumbLink>
          <BreadcrumbLink
            href={`/app/company/company1/project/project1/operations/${operationId}`}
          >
            {operationId}
          </BreadcrumbLink>
        </BreadcrumbRoot>
        <h1>Documents</h1>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <ul>
              {data?.documents.map((document) => (
                <li key={document.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={assignedDocumentIds.has(document.id)}
                    onCheckedChange={() => toggleDocument(document.id)}
                  />
                  {document.id} ({document.docType} - {document.codeAdeme})
                </li>
              ))}
            </ul>
            <Button onClick={handleSave} disabled={saveDocuments.isPending}>
              Save
            </Button>
          </div>
        )}
      </AppLayoutPage>
    </Suspense>
  );
}
