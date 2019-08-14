import { Injectable } from '@nestjs/common';
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
}
