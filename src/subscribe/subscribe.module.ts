import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribeRepository } from './subscribe.repository';

@Module({ //import the subscribe repository into subscribe module
  imports: [TypeOrmModule.forFeature([SubscribeRepository])], 
  controllers: [SubscribeController],
  providers: [SubscribeService]
})
export class SubscribeModule {}
