import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { AuthModule } from '../auth/auth.module';

@Module({ //import comment repository
  imports: [TypeOrmModule.forFeature([CommentRepository]), AuthModule], //import auth module to use jwt/passport
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
