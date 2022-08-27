import { ApiProperty } from "@nestjs/swagger";

export class UpdateAdminDto {

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
    admins: any[];
}