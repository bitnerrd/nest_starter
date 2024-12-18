import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthEmailLoginDto {

  @ApiProperty({
    required: true,
    type: String,
    description: 'email',
    example: "johndoe@example.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Usama@123' })
  @IsNotEmpty()
  password: string;

}
