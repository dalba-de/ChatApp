import { ApiProperty } from "@nestjs/swagger";

export class MakePublicRoomDto {

    @ApiProperty({
        example: '3'
    })
    id: number

    @ApiProperty({
        example: 'false'
    })
    private: boolean

    @ApiProperty({
        example: null
    })
    password: string
}
