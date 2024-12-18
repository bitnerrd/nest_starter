import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches
} from "class-validator";
import { ProfessionEnum } from 'src/utils/enums/enums';

export class SignUpDto {

  @ApiProperty({
    required: true,
    type: String,
    description: 'email',
    example: "johndoe@example.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'Usama@123'
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/)
  password: string;

  constructor(creds: { email: string; password: string }) {
    this.email = creds?.email;
    this.password = creds?.password;
  }

  @ApiProperty({ example: "+923228064081" })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: "John" })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "I am passionate about using my voice to support and empower others. Whether it's fighting for social justice, promoting environmental sustainability, or advocating for the needs of marginalized communities, I am committed to using my platform to make a positive impact on the world." })
  @IsOptional()
  about: string;

  @ApiProperty({ example: "c522829b-dab3-4abb-b68b-9ebcc6f5094b" })
  @IsOptional()
  profilePic: string;

  @ApiProperty({ example: "c522829b-dab3-4abb-b68b-9ebcc6f5094b" })
  @IsOptional()
  pitchDeck: string;

  @ApiProperty({ example: "c522829b-dab3-4abb-b68b-9ebcc6f5094b" })
  @IsOptional()
  businessPlan: string;
}