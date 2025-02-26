'use client';

import { Suspense, useEffect, useState } from 'react';

import {
  Alert,
  Card,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Stack,
  Table,
} from '@chakra-ui/react';
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
  const projectId = params?.projectId?.toString() ?? '';
  const operationId = params?.operationId?.toString() ?? '';

  const { isLoading, error, data } = trpc.operations.getDocuments.useQuery({
    companyId,
    docType: 'ATTESTATION_RGE',
  });
  const saveDocuments = trpc.operations.setDocumentsForOperation.useMutation({
    onError: () => {
      toastCustom({
        status: 'error',
        title: t('abrico:errors.save'),
      });
    },
  });

  const [assignedDocumentIds, setAssignedDocumentIds] = useState<Set<string>>(
    new Set()
  );

  const { t } = useTranslation(['abrico']);

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

  useEffect(() => {
    if (error) {
      toastCustom({
        status: 'error',
        title: t('abrico:errors.loading'),
      });
    }
  }, [error]);

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
          <BreadcrumbLink href="/app">
            {t('abrico:breadCrumbs.application')}
          </BreadcrumbLink>
          <BreadcrumbLink
            href={`/app/company/${companyId}/project/${projectId}/operations`}
          >
            {t('abrico:breadCrumbs.operations')}
          </BreadcrumbLink>
          <BreadcrumbLink
            href={`/app/company/${companyId}/project/${projectId}/operations/${operationId}`}
          >
            {operationId}
          </BreadcrumbLink>
        </BreadcrumbRoot>
        <Heading mt="5" mb="5" fontSize="lg">
          {t('abrico:breadCrumbs.documents')}
        </Heading>

        {error !== null && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{t('abrico:errors.loading')}</Alert.Title>
              <Alert.Description>
                {t('abrico:errors.loading')}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {error === null && isLoading && <Spinner />}

        {error === null && !isLoading && (
          <Stack>
            <Grid templateColumns="repeat(4, 1fr)" gap="6">
              {data?.documents.map((document) => (
                <GridItem key={document.id}>
                  <Card.Root>
                    <Card.Body>
                      <Card.Title mt="2">{document.id}</Card.Title>
                      <Card.Description>
                        {t('abrico:operations.codeAdeme')}: {document.codeAdeme}
                      </Card.Description>
                    </Card.Body>
                    <Card.Footer>
                      <Checkbox
                        checked={assignedDocumentIds.has(document.id)}
                        onCheckedChange={() => toggleDocument(document.id)}
                      />
                    </Card.Footer>
                  </Card.Root>
                </GridItem>
              ))}
            </Grid>
            <Button
              mt="4"
              onClick={handleSave}
              disabled={saveDocuments.isPending}
            >
              {t('abrico:operations.save')}
            </Button>
          </Stack>
        )}
      </AppLayoutPage>
    </Suspense>
  );
}
