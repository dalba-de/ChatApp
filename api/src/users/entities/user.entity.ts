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

    @Column('text', { array: true, nullable: true })
    mutes: string[]

    @Column('text', { array: true, nullable: true })
    usersMuteMe: string[];

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    // @OneToMany(() => Room, (adminRooms: Room) => adminRooms.admin)
    // adminRooms: Room[];

    @ManyToMany(() => Room, (room: Room) => room.users)
    rooms: Room;

    @ManyToMany(() => Room, (room: Room) => room.admins)
    adminRooms: Room;
}