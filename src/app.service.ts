import { Injectable } from '@nestjs/common';
import { PrismaBrokenService } from './prisma-broken.service';
import { prisma as prismaWorking } from './prisma-working.service';

@Injectable()
export class AppService {
  constructor(private prismaBroken: PrismaBrokenService) {}

  async working(): Promise<unknown> {
    return prismaWorking.user.findMany();
  }

  async broken(): Promise<unknown> {
    return this.prismaBroken.user.findMany();
  }
}
