import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Message } from "../../messages/entities/message.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string;

    @Column()
    private: boolean;

    @Column()
    isGroup: boolean;

    @Column({nullable: true})
    password: string;

    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];

    @ManyToMany(() => User, (user: User) => user.rooms, {
        cascade: true,
        eager: true
    })
    @JoinTable()
    users : User[]
}
