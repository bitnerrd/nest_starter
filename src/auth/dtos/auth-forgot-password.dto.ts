import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthForgotPasswordDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'email',
    example: 'anas@example.com',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsEmail()
  email: string;
}
