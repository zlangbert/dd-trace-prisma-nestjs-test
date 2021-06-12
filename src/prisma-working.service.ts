import { tracer } from './tracer';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

prisma.$use(async (params, next) => {
  const tags = {
    'span.kind': 'client',
    'span.type': 'sql',
    'prisma.model': params.model,
    'prisma.action': params.action,
  };

  return tracer.trace('prisma.query', { tags }, () => next(params));
});

prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
  // add query to prisma span
  const span = tracer.scope().active();
  console.log('span:', span);
  span?.setTag('resource.name', e.query);
});

export { prisma };
