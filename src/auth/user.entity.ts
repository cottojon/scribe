import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username']) // expects an array of column names
export class User extends BaseEntity{
    @PrimaryGeneratedColumn() // primary key and auto generated
    id: number;

    @Column() 
    username: string;

    @Column()
    password: string;


    @Column()
    salt: string;



    // custom mehtod to validate our password
    // receive in a password from the client and hash it with user salt
    // compare user password(hash) with generated hash
    // if equal return true else false
    async validatePassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        // true if client side password was correct
        return (hash === this.password);
    }
}