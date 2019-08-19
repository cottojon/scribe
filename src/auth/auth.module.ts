import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
@Module({ 
  imports: [ // provide the strategy passport it gonna use
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
    secret: 'topSecret51', // the secret we will use in our token, we will chane this later
    signOptions: {
      expiresIn: 3600, // 3600 seconds == 1 hr
    },
  }),
    TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
