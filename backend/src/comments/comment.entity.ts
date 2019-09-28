import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { Clip } from '../clips/clip.entity';
import { User } from '../auth/user.entity';

/*this is our relationship table that we have created to relate users and clips and comments
In TypeORM, we can either let typeorm make this table using @JoinTable() or
we can creeate this table. I choose to make this table explicity.

The relationship 'comment' is many-to-many-many  with users and clips and comments

Each User can comment on many clips
Each clip can be commented on by many users

*/

@Entity()
export class Comment extends BaseEntity {
    //id, userId, and clipId combine to form a super key

    @PrimaryGeneratedColumn() //auto generated
    id: number;


    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    clipId: number;

    //will set itself anytime an entity is created
    @CreateDateColumn({ type: 'timestamptz' }) //timestamp with time zone
    created_at: Date;


    @Column({ type: "text" }) //want a text datatype rather than varchar
    comment: string;

    // this is how we relate the three entities for many-to-many
    @ManyToOne(type => User, user => user.comments)
    user: User;


    @ManyToOne(type => Clip, clip => clip.comments, {
        eager: true,  //every time we load a like entity the clip will come with it no need to inner join tables (only works with eveything exept query builder)
        onUpdate: "CASCADE" //update if channel id get updated
    })
    clip: Clip;
}

