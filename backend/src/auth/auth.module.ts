import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

//first we go with env variables than config

@Module({ 
  imports: [ // provide the strategy passport it gonna use
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
    secret: process.env.JWT_SECRET || jwtConfig.secret, // the secret we will use in our token, we will chane this later
    signOptions: {
      expiresIn: jwtConfig.expiresIn, // 3600 seconds == 1 hr
    },
  }),
    TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // want nest to instantiate for us
  exports: [JwtStrategy, PassportModule] // want to export these to the other modules for authorization
})
export class AuthModule {}
