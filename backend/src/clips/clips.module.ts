import { Module } from '@nestjs/common';
import { ClipsController } from './clips.controller';
import { ClipsService } from './clips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClipRepository } from './clip.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClipRepository]),  AuthModule],
  controllers: [ClipsController],
  providers: [ClipsService]
})
export class ClipsModule {}
