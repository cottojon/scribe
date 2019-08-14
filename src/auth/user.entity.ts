import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn() // p key and auto generated
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}