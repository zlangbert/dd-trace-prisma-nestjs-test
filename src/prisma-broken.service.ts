import { tracer } from './tracer';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

// based on example https://docs.nestjs.com/recipes/prisma
@Injectable()
export class PrismaBrokenService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
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

    this.$use(async (params, next) => {
      const tags = {
        'span.kind': 'client',
        'span.type': 'sql',
        'prisma.model': params.model,
        'prisma.action': params.action,
      };

      return tracer.trace('prisma.query', { tags }, () => next(params));
    });

    this.$on('query' as never, (e: Prisma.QueryEvent) => {
      // add query to prisma span
      const span = tracer.scope().active();
      console.log('span:', span);
      span?.setTag('resource.name', e.query);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
