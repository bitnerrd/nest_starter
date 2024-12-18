import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { RoleEnum } from 'src/utils/enums/enums';

export class UpdateUserDto {
  @ApiProperty({ example: '+923117765261' })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: 'Muhammad' })
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Anas' })
  @IsOptional()
  lastName: string;

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

export class RoleDto {
  @ApiProperty({
    description: 'Select Role',
    enum: RoleEnum,
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
