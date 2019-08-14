import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";


@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        // descruct fields
        const { username, password } = authCredentialsDto;

        // create new user and assign properties
        const user = new User();
        user.username = username;
        user.password = password;

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
}