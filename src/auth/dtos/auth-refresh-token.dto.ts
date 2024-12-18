import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthRefreshTokenDto {
    
    @ApiProperty({
        example: 'asdasd'
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}