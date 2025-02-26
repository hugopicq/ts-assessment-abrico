import React from 'react';

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/Logo';
import { BreadcrumbLink, BreadcrumbRoot } from '@/components/ui/breadcrumb';
import { LinkButton } from '@/components/ui/link-button';
import { AppLayoutPage } from '@/features/app/AppLayoutPage';

export default function PageHome() {
  const { t } = useTranslation(['appHome', 'account', 'abrico']);

  return (
    <AppLayoutPage>
      <BreadcrumbRoot>
        <BreadcrumbLink href="/app">
          {t('abrico:breadCrumbs.application')}
        </BreadcrumbLink>
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
            <LinkButton
              href={`/app/company/company1/project/project1/operations`}
            >
              {t('appHome:welcome.manageOperationsLink')}
            </LinkButton>
          </Text>
        </Stack>
      </Stack>
    </AppLayoutPage>
  );
}
