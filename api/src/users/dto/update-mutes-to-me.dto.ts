import { ApiProperty } from '@nestjs/swagger'; 

export class UpdateMutesToMeDto {

    @ApiProperty({
        example: '1'
    })
    id: number
    // mutes: string[]

    @ApiProperty({
        example: ["Jan"]
    })
    usersMuteMe: any[]
}