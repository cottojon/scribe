import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { AuthModule } from '../auth/auth.module';

@Module({// import like reposioty for dependency injection in the like.service.ts
  imports: [TypeOrmModule.forFeature([LikeRepository]), AuthModule],  // import auth module to use jwt/passport for guarding routes
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
