import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailExistDto {

    @ApiProperty({
        required: true,
        type: String,
        description: 'email',
        example: "johndoe@example.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

}