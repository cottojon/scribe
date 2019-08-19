import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        // descruct fields
        const { username, password } = authCredentialsDto;

        // generate salt
        // these are async operations and take some time to compute
        // the salt will always generate a unique salt for us
        const salt = await bcrypt.genSalt();

        // create new user and assign properties
        const user = new User();
        user.username = username;
        user.salt = salt;
        // has our password + salt and store into password column
        user.password = await this.hashPassword(password, salt);

        //try the save query
        try {
            await user.save(); //save user to the database

        } catch (error) {
            // catch our duplicate username typeorm error code 23505 = duplicate values
            if (error.code === '23505') {
                throw new ConflictException('Username already exists'); //status code 409
            }else{
                throw new InternalServerErrorException(); //status code 500
            }
        }
    }

    //sign in method
    // will return a username is we successfully validate a password
    async validateUserPassword(authCredentialDto: AuthCredentialsDto): Promise<string>{
        //destruct 
        const {username, password} = authCredentialDto;

        //grab user
        const user = await this.findOne({username});

        //check if the user exist and then validate the user password
        if(user && user.validatePassword(password)){
            return user.username;
        }else{
            return null;
        }
    }


    // hashing password and salt using bcrypt
    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt);
    }
}