import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from "./user.entity";

// This class represents our strategy to handle our jwt tokens
// passport will validate our request that are guarded and handle placing our validate 
// return value into our headers for us


// want to make this class dependency injectable
@Injectable()
// will be using the jwt strategy in our passport strategy
export class JwtStrategy extends PassportStrategy(Strategy){

    // inject userRepository for our validate method
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository){
       // pass in options for our super PassportStrategy class in its constructor
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // define how to retrieve the jwt token from the request
            secretOrKey: 'topSecret51', // the jwt secret we are using
        }); 
    }



    // this method must exist for every strategy
    // the payload is already verified by passwport when this method executes
    // what we return from this method will be injected into the original request object that  had the accessToken
    async validate(payload: JwtPayload): Promise<User>{
        // destruct
        const {username}= payload;

        //retreive the user from the DB to attach to the original request
        const user = await this.userRepository.findOne({username});

        // user not found
        if(!user){
            throw new UnauthorizedException();
        }


        return user;

    }

}