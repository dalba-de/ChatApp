import { ApiProperty } from '@nestjs/swagger'; 

export class UpdateStatusDto {

    @ApiProperty({
        example: '1'
    })
    id: number

    @ApiProperty({
        example: 'true'
    })
    online: boolean
}