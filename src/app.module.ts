import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { ClipsModule } from './clips/clips.module';


@Module({
  imports: [ChannelsModule, ClipsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
