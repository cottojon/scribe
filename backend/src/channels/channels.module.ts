import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelRepository } from './channel.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelRepository]),  AuthModule], //import auth module so we can use guards(jwt)
  controllers: [ChannelsController],
  providers: [ChannelsService]
})
export class ChannelsModule {}
