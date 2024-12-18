import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class AuthResetPasswordDto {

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    required: true,
    example: 'Usama@123'
  })
  @IsString()
  @Length(8, 64)
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/)
  password: string;
}
