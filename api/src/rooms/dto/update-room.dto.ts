import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoomDto {

    @ApiProperty({
        example: '4'
    })
    id: number;

    @ApiProperty({
        example: [
            {"id": 1},
            {"id": 2}
        ]
    })
    users: any[];
}