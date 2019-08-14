import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

    // inject our user repo when the service is initialized
    constructor( @InjectRepository(UserRepository) private userRepository: UserRepository){}
}
