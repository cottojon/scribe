import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Clip } from "../clips/clip.entity";
import { Subscribe } from "../subscribe/subscribe.entity";

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


    
    //this is for our many to many relationship with channels to define our subscribes join table
    @OneToMany(type => Subscribe, subscribe => subscribe.channel)
    subscribes: Subscribe[];
  
}