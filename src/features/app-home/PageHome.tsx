import React from 'react';

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/Logo';
import { BreadcrumbLink, BreadcrumbRoot } from '@/components/ui/breadcrumb';
import { AppLayoutPage } from '@/features/app/AppLayoutPage';

export default function PageHome() {
  const { t } = useTranslation(['appHome', 'account']);

  return (
    <AppLayoutPage>
      <BreadcrumbRoot>
        <BreadcrumbLink href="/app">Application</BreadcrumbLink>
      </BreadcrumbRoot>
      <Stack flex={1} gap={6}>
        <Flex
          display={{ base: 'flex', md: 'none' }}
          py={2}
          alignItems="center"
          justifyContent="center"
        >
          <Logo />
        </Flex>

        <Stack>
          <Heading fontSize="lg">{t('appHome:welcome.title')}</Heading>
          <Text display="block">
            {t('appHome:welcome.description')}
            <br />
          </Text>
        </Stack>
        <Stack>
          <Text display="block">
            <Link href={`/app/company/company1/project/project1/operations`}>
              Manage project1 operations
            </Link>
          </Text>
        </Stack>
      </Stack>
    </AppLayoutPage>
  );
}
