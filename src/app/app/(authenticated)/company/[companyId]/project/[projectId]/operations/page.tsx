'use client';

import { Suspense, useEffect, useState } from 'react';

import { Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { toastCustom } from '@/components/Toast';
import { BreadcrumbLink, BreadcrumbRoot } from '@/components/ui/breadcrumb';
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

  const { t } = useTranslation(['auth']);

  return (
    <Suspense>
      <AppLayoutPage>
        <BreadcrumbRoot>
          <BreadcrumbLink href="/app">Application</BreadcrumbLink>
          <BreadcrumbLink href="/app/company/company1/project/project1/operations">
            Operations
          </BreadcrumbLink>
        </BreadcrumbRoot>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {data?.operations.map((operation) => (
              <div key={operation.id}>
                <Link
                  href={`/app/company/${companyId}/project/${projectId}/operations/${operation.id}`}
                >
                  {operation.id}
                </Link>
              </div>
            ))}
          </>
        )}
      </AppLayoutPage>
    </Suspense>
  );
}
