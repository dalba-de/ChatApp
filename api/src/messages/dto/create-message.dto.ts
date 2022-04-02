import { User } from "../../users/entities/user.entity";
export class CreateMessageDto {
    message: string;
    user: User;
}
