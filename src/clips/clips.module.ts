import { Module } from '@nestjs/common';
import { ClipsController } from './clips.controller';
import { ClipsService } from './clips.service';

@Module({
  controllers: [ClipsController],
  providers: [ClipsService]
})
export class ClipsModule {}
