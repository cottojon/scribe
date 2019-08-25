import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { ClipsModule } from './clips/clips.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule} from '@nestjs/typeorm';
import { SubscribeModule } from './subscribe/subscribe.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ChannelsModule, ClipsModule, AuthModule, SubscribeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
