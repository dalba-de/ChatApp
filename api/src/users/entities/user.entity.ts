import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Message } from "../../messages/entities/message.entity";
import { Room } from "../../rooms/entities/room.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socket: string;

    @Column({unique: true})
    name: string;

    @Column()
    online: boolean;

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @ManyToMany(() => Room, (room: Room) => room.users)
    rooms: Room;
}