import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Clip } from "src/clips/clip.entity";

@Entity()
export class Channel extends BaseEntity{
    @PrimaryGeneratedColumn() // primary key and auto generated
    id: number;

    @Column() 
    name: string;

    @Column()
    subsystem: string;

    @Column()
    location: string;

    @Column()
    program: string;


    @OneToMany(type => Clip, clip => clip.channel) // our relation to clips
    clip: Clip[];

    //@Column()
    //clipId: number;
}