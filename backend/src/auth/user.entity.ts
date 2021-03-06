import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Like } from '../likes/like.entity';
import { Comment } from '../comments/comment.entity';
import { Subscribe } from '../subscribe/subscribe.entity';

@Entity()
@Unique(['username']) // expects an array of column names
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() // primary key and auto generated
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;


    @Column()
    salt: string;




    @Column({
        type: 'bytea',
        nullable: true,
    })
    image: Buffer;


    // custom mehtod to validate our password
    // receive in a password from the client and hash it with user salt
    // compare user password(hash) with generated hash
    // if equal return true else false
    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        // true if client side password was correct
        return (hash === this.password);
    }



    //this is for our many to many relationship with channels to define our subscribes join table
    @OneToMany(type => Subscribe, subscribe => subscribe.user)
    subscribes: Subscribe[];


    //this is for our many to many relationship with channels to define our like join table
    @OneToMany(type => Like, like => like.user)
    likes: Like[];


    //this is for our many to many to many relationship with users, and comments to define our comment join table
    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];


}