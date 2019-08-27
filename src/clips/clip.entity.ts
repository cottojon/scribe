import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Channel } from "src/channels/channel.entity";
import { Like } from '../likes/like.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Clip extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"text"}) //want a text datatype rather than varchar
    text: string;

    @Column({type:"text", nullable: true}) // allow the column to be null until clip gets revised
    revised_text: string;

    @Column()
    speaker: string;

    //will set itself anytime an entity is created
    @CreateDateColumn({ type: 'timestamptz' }) //timestamp with time zone
    created_at: Date;

    //will update when entity is saved automatically
    @UpdateDateColumn({ type: 'timestamptz' })//timestamp with time zone
    revised_at: Date;


    @Column()
    revised: boolean;


    @Column()
    path_to_file: string;


    @ManyToOne(type => Channel, channel => channel.clip,  {  
        eager: true,  //every time we load a clip entity the channel will come with it no need to join tables (only works with find)
        onUpdate: "CASCADE" //update if channel id get updated
    }) //our relation to channel table
    channel: Channel;


    @Column() // this is the column where we store our relationship ids, 
    // typeorm creates this automatically from the relationship above, 
    // but if we want to have access in repository to it we must define it here
    channelId: number;



    //this is for our many to many relationship with channels to define our like join table
    @OneToMany(type => Like, like => like.clip)
    likes: Like[];



     //this is for our many to many to many relationship with users, and comments to define our comment join table
     @OneToMany(type => Comment, comment => comment.clip)
     comments: Comment[];



}