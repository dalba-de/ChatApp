import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {

    @ApiProperty({
        example: '4'
    })
    id: number;

    @ApiProperty({
        example: '123456'
    })
    password: string;
}