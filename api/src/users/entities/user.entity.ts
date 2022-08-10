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

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @OneToMany(() => Room, (adminRooms: Room) => adminRooms.admin)
    adminRooms: Room[];

    @ManyToMany(() => Room, (room: Room) => room.users)
    rooms: Room;

    // @ManyToMany(() => User, (user: User) => user.mutes, {
    //     cascade: true
    // })
    // @JoinTable()
    // muted: User[]

    // @ManyToMany(() => User, (user: User) => user.muted, {})
    // mutes: User[]
}