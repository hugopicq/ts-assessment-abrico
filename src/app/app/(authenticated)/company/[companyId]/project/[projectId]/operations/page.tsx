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
} from '@chakra-ui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { toastCustom } from '@/components/Toast';
import { BreadcrumbLink, BreadcrumbRoot } from '@/components/ui/breadcrumb';
import { LinkButton } from '@/components/ui/link-button';
import PageHome from '@/features/app-home/PageHome';
import { AppLayoutPage } from '@/features/app/AppLayoutPage';
import { trpc } from '@/lib/trpc/client';

export default function Page() {
  const params = useParams();

  const companyId = params?.companyId?.toString() ?? '';
  const projectId = params?.projectId?.toString() ?? '';

  const { isLoading, error, data } = trpc.operations.getOperations.useQuery({
    projectId,
  });

  const { t } = useTranslation(['abrico']);

  useEffect(() => {
    if (error) {
      toastCustom({
        status: 'error',
        title: t('abrico:errors.loading'),
      });
    }
  }, [error]);

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
        </BreadcrumbRoot>
        <Heading mt="5" mb="5" fontSize="lg">
          {t('abrico:breadCrumbs.operations')}
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
            <Grid templateColumns="repeat(5, 1fr)" gap="6">
              {data?.operations.map((operation) => (
                <GridItem key={operation.id}>
                  <Card.Root>
                    <Card.Body>
                      <Card.Title mt="2">
                        {operation.id} ({operation.codeAdeme})
                      </Card.Title>
                      <Card.Description mt="4">
                        <LinkButton
                          href={`/app/company/${companyId}/project/${projectId}/operations/${operation.id}`}
                        >
                          {t('abrico:operations.updateDocuments')}
                        </LinkButton>
                      </Card.Description>
                    </Card.Body>
                  </Card.Root>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        )}
      </AppLayoutPage>
    </Suspense>
  );
}
