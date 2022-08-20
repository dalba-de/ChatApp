import { ApiProperty } from '@nestjs/swagger'; 

export class UpdateUserDto {

    @ApiProperty({
        example: '1'
    })
    id: number;
    
    @ApiProperty({
        example: '5JF9NpFPdzHOxO86AAAD'
    })
    socket: string;

    @ApiProperty({
        example: 'true'
    })
    online: boolean;
}