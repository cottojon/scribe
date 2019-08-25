import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribeRepository } from './subscribe.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({ //import the subscribe repository into subscribe module
  imports: [TypeOrmModule.forFeature([SubscribeRepository]), AuthModule], //import auth module to use jwt strategy and paspport
  controllers: [SubscribeController],
  providers: [SubscribeService]
})
export class SubscribeModule {}
