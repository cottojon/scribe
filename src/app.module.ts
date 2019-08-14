import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { ClipsModule } from './clips/clips.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ChannelsModule, ClipsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
