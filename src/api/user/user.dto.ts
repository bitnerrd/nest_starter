import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}

export class UserProfileUpdateDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @ApiProperty()
  phone?: number;

  @IsOptional()
  @ApiProperty()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  coverPhoto?: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dateFormat?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  language?: string;
}
