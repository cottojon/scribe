import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}