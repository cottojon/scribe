import { Module } from '@nestjs/common';
import { ClipsController } from './clips.controller';
import { ClipsService } from './clips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClipRepository } from './clip.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClipRepository])],
  controllers: [ClipsController],
  providers: [ClipsService]
})
export class ClipsModule {}
