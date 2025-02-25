import { createRepositories } from 'prisma/seed/models/repository';
import { createUsers } from 'prisma/seed/models/user';
import { prisma } from 'prisma/seed/utils';

import { createDocuments } from './models/document';

async function main() {
  await createRepositories();
  await createUsers();
  await createDocuments();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
