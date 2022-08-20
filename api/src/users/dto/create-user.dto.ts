import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'qJSz9Kgzd5zF7eK1AAAD'
    })
    socket : string;

    @ApiProperty({
        example: 'David'
    })
    name : string;

    @ApiProperty({
        example: 'true'
    })
    online : boolean;
}
