import { User } from "../../users/entities/user.entity";
import { Room } from "../../rooms/entities/room.entity";

export class CreateMessageDto {
    message: string;
    user: User;
    room: Room;
}
