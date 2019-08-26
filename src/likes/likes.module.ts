import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikeRepository])], // import like reposioty for dependency injection in the like.service.ts
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
