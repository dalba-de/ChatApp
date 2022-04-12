// import { PartialType } from '@nestjs/mapped-types';
// import { CreateRoomDto } from './create-room.dto';

// export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

export class UpdateRoomDto {
    id: number;
    users: any[];
}