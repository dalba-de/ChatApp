import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Room } from "../../rooms/entities/room.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @ManyToOne(() => User, (user) => user.messages, {
        cascade: true,
        eager: true
    })
    user: User;
    
    @ManyToOne(() => Room, (room) => room.messages, {
        cascade: true,
        eager: true,
        onDelete: "CASCADE"
    })
    room: Room;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    time: Date;
}
