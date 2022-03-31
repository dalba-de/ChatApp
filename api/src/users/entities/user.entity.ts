import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Message } from "../../messages/entities/message.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socket: string;

    @Column({unique: true})
    name: string;

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];
}