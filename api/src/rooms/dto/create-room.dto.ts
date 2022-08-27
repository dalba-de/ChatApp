import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomDto {

    @ApiProperty({
        example: 'Tardis'
    })
    name: string

    @ApiProperty({
        example: 'false'
    })
    private: boolean

    @ApiProperty({
        example: 'true'
    })
    isGroup: boolean

    @ApiProperty({
        example: null
    })
    password: string

    @ApiProperty({
        example: [
            {"id": 1}
        ]
    })
    users: any[]

    @ApiProperty({
        example: [
            {"id": 1}
        ]
    })
    admins: any[]
}
