import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Clip } from '../clips/clip.entity';
import { User } from '../auth/user.entity';

 /*this is our relationship table that we have created to relate users and clips
 In TypeORM, we can either let typeorm make this table using @JoinTable() or
 we can creeate this table. I choose to make this table explicity.

 The relationship 'like' is many-to-many  with users and clips

 Each User can like many clips
 Each clip can be likes by many users

*/

@Entity()
export class Like extends BaseEntity{
   
    // userId and channelId combined as a superkey/composite key
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    clipId: number;

    // this is how we relate the two entities for many-to-many
    @ManyToOne(type => User, user => user.likes)
    user: User;


    @ManyToOne(type => Clip, clip => clip.likes, {  
        eager: true,  //every time we load a like entity the clip will come with it no need to inner join tables (only works with eveything exept query builder)
        onUpdate: "CASCADE" //update if channel id get updated
    })
    clip: Clip;
}

