import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";


@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        // descruct fields
        const { username, password } = authCredentialsDto;

        // create new user and assign properties
        const user = new User();
        user.username = username;
        user.password = password;

        // do not return anything especially since it contains the password
        await user.save(); // save our user to the database
    }
}