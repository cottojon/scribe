import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { ChangeAuthCredentialsDto } from './dto/change-auth-credentials.dto';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository) { }

    // our sign up method
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userRepository.signUp(authCredentialsDto);
    }

    // our signIn method
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        // if username exist and password is valid we will get back the username, else undefined
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        // throw an exception if user does not exist
        if (!username) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        // create jwt payload
        const payload: JwtPayload = { username };
        // generate the token with our payload
        const accessToken = await this.jwtService.sign(payload);

        // return object with the jwt accessToken
        return { accessToken };
    }

    async uploadImage(file, user: User): Promise<void> {

        user.image = file.buffer;

        //try the save query
        try {
            await user.save(); //save user to the database

        } catch (error) {
            console.log(error);

            throw new InternalServerErrorException(); //status code 500
        }

        return;
    }

    //get a username by just id
    async getUsernameById(id: number): Promise<{username}>{
        //grab user by id
        const user = await this.userRepository.findOne({ id });

        //check if the user exist and then validate the user password
        if (user) {
            return {username: user.username};
        } else {
            throw new ConflictException('User does not exist'); //status code 409

        }
    }


    async changePassword(changeAuthCredentialsDto: ChangeAuthCredentialsDto, user: User): Promise<void> {
        return await this.userRepository.changePassword(changeAuthCredentialsDto, user);
    }
}
