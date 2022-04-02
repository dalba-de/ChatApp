import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @Column()
    room: string

    @ManyToOne(() => User, (user) => user.messages, {
        cascade: true,
        eager: true
    })
    user: User;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    time: Date;
}
