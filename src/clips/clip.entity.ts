import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Clip extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //our relation to channel table
    channel_id: number;

    @Column("text") //want a text datatype rather than varchar
    text: string;

    @Column("text")
    revised_text: string;

    @Column()
    speaker: string;

    //will set itself anytime an entity is created
    @CreateDateColumn({ type: 'timestamptz' }) //date we a timestamp
    created_at: Date;

    //will update when entity is saved automatically
    @UpdateDateColumn({ type: 'timestamptz' })//date with a timestamp
    revised_at: Date;


    @Column()
    revised: boolean;


    @Column()
    path_to_file: string;



}