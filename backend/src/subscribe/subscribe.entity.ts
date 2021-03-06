import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Channel } from '../channels/channel.entity';


 /*this is our relationship table that we have created to relate users and channels
 In TypeORM, we can either let typeorm make this table using @JoinTable() or
 we can creeate this table. I choose to make this table explicity.

 The relationship 'subscribes' is many-to-many  with users and subscribes

*/

@Entity()
export class Subscribe extends BaseEntity{
   
    // userId and channelId combined as a superkey/composite key
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    channelId: number;

    // this is how we relate the two entities for many-to-many
    @ManyToOne(type => User, user => user.subscribes)
    user: User;


    @ManyToOne(type => Channel, channel => channel.subscribes, {  
        eager: true,  //every time we load a subscribe entity the channel will come with it no need to join tables (only works with find)
        onUpdate: "CASCADE" //update if channel id get updated
    })
    channel: Channel;
}

