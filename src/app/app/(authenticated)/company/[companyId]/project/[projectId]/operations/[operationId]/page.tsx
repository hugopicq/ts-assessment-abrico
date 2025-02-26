'use client';

import { Suspense, useEffect, useState } from 'react';

import { Spinner } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { toastCustom } from '@/components/Toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PageHome from '@/features/app-home/PageHome';
import { trpc } from '@/lib/trpc/client';

export default function Page() {
  const params = useParams();

  const companyId = params?.companyId?.toString() ?? '';
  const operationId = params?.operationId?.toString() ?? '';

  const { isLoading, error, data } = trpc.operations.getDocuments.useQuery({
    companyId,
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
      newChecked.has(id) ? newChecked.delete(id) : newChecked.add(id);
      return newChecked;
    });
  };

  return (
    <Suspense>
      <div>
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
                  {document.id}
                </li>
              ))}
            </ul>
            <Button onClick={handleSave} disabled={saveDocuments.isPending}>
              Save
            </Button>
          </div>
        )}
      </div>
    </Suspense>
  );
}
