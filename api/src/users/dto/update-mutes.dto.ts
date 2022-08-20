import { User } from "../entities/user.entity";
import { ApiProperty } from '@nestjs/swagger'; 

export class UpdateMutesDto {

    @ApiProperty({
        example: '1'
    })
    id: number
    // mutes: string[]

    @ApiProperty({
        example: ["Jan"]
    })
    mutes: any[]
}