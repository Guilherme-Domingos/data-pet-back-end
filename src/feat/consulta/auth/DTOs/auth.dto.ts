import { ApiProperty } from "@nestjs/swagger";

export class authDTO{
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}