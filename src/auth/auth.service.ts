import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {

    constructor( @InjectRepository(UserRepository) private userRepository: UserRepository){}

    // our sign up method
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
       return await this.userRepository.signUp(authCredentialsDto);
    }

    //our signIn method
    async signIn(authCredentialsDto: AuthCredentialsDto){
        //if username exist and password is valid we will get back the username, else undefined
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        //throw an excetion if user does not exist
        if(!username){
            throw new UnauthorizedException("Invalid Credentials");
        }

        //jwt token used here
    }
}
