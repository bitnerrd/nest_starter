import {
  IsEmail,
  IsIdentityCard,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  phone?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(["google", "email"])
  @IsOptional()
  provider: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;
}
export class SignupDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  // @Expose()
  // _id: any;

  constructor(partial: Partial<SignupDTO>) {
    Object.assign(this, partial);
  }
}
export class VerifyOTPDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ForgetPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ResendOtpDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}

export enum resetType {
  otp = "OTP",
  link = "LINK",
}

export enum AUTHPROVIDER {
  GOOGLE = "google",
  EMAIL = "email",
}
