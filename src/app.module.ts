import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';


@Module({
  imports: [ChannelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
