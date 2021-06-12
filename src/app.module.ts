import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaBrokenService } from './prisma-broken.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaBrokenService],
})
export class AppModule {}
