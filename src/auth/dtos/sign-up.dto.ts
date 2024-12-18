import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ProfessionEnum } from 'src/utils/enums/enums';

export class SignUpDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'email',
    example: 'anas@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'Anas@123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/,
  )
  password: string;

  constructor(creds: { email: string; password: string }) {
    this.email = creds?.email;
    this.password = creds?.password;
  }

  @ApiProperty({ example: '+923117765261' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'Muhammad' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Anas' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  about: string;
}
