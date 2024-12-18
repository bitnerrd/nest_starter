import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ProfessionEnum, RoleEnum } from 'src/utils/enums/enums';

export class UpdateUserDto {
  @ApiProperty({ example: '+923228064081' })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'Lahore' })
  @IsOptional()
  city: string;

  @ApiProperty({ example: 'Pakistan' })
  @IsOptional()
  country: string;

  @ApiProperty({
    example:
      "I am passionate about using my voice to support and empower others. Whether it's fighting for social justice, promoting environmental sustainability, or advocating for the needs of marginalized communities, I am committed to using my platform to make a positive impact on the world.",
  })
  @IsOptional()
  about: string;

  @ApiProperty({ example: 'https//:user/linkedin.com' })
  @IsOptional()
  linkedinProfile: string;

  @ApiProperty({ type: 'enum', enum: ProfessionEnum, example: 'founder' })
  @IsOptional()
  designation: ProfessionEnum;

  @ApiProperty({ example: 'c522829b-dab3-4abb-b68b-9ebcc6f5094b' })
  @IsOptional()
  profilePic: string;

  @ApiPropertyOptional({
    required: false,
    type: String,
    example: 'test@123',
  })
  @IsString()
  @IsOptional()
  @Length(8, 64)
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/,
  )
  password: string;

  @ApiProperty({ example: true })
  @IsOptional()
  isActive: boolean;

  fullName?: string;
}

export class CreateVisitorDto {
  @ApiProperty({ example: '59.103.120.15' })
  @IsNotEmpty()
  userIp: string;
}

export class RoleDto {
  @ApiProperty({
    description: 'Select Role',
    enum: RoleEnum,
    example: RoleEnum.sub_admin,
  })
  @IsEnum(RoleEnum)
  @IsString()
  @IsNotEmpty()
  role: RoleEnum;
}

export class SendSubAdminDetailsDto {
  @ApiProperty({ example: 'c522829b-dab3-4abb-b68b-9ebcc6f5094b' })
  @IsNotEmpty()
  subAdminId: string;

  @ApiProperty({ example: 'user@gmail.com' })
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'Temp@1234' })
  @IsNotEmpty()
  password: string;
}
