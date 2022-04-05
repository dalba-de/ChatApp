import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Message } from "../../messages/entities/message.entity";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string;

    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];
}
