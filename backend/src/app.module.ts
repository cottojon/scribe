import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { ClipsModule } from './clips/clips.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule} from '@nestjs/typeorm';
import { SubscribeModule } from './subscribe/subscribe.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { RealtimeGateway } from './realtime/realtime.gateway';



@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ChannelsModule, ClipsModule, AuthModule, SubscribeModule, LikesModule, CommentsModule],
  controllers: [],
  providers: [RealtimeGateway],
})
export class AppModule {}
