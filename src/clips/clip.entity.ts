import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Clip extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //our relation to channel table
    channel_id: number;

    @Column({type:"text"}) //want a text datatype rather than varchar
    text: string;

    @Column({type:"text"})
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



}