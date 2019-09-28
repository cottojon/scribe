import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
         @InjectRepository(UserRepository) 
         private userRepository: UserRepository){}

    // our sign up method
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
       return await this.userRepository.signUp(authCredentialsDto);
    }

    // our signIn method
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        // if username exist and password is valid we will get back the username, else undefined
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        // throw an exception if user does not exist
        if(!username){
            throw new UnauthorizedException("Invalid Credentials");
        }

        // create jwt payload
        const payload: JwtPayload = { username };
        // generate the token with our payload
        const accessToken = await  this.jwtService.sign(payload);

        // return object with the jwt accessToken
        return {accessToken};
    }
}