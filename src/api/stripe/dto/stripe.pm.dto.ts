import {
  IsString,
  IsObject,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class Address {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2: string;

  @IsString()
  postal_code: string;

  @IsString()
  state: string;
}

class BillingDetails {
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;
}

class Checks {
  @IsOptional()
  @IsString()
  address_line1_check: string;

  @IsOptional()
  @IsString()
  address_postal_code_check: string;

  @IsOptional()
  @IsString()
  cvc_check: string;
}

class Networks {
  @IsArray()
  @IsString({ each: true })
  available: string[];

  @IsOptional()
  @IsString()
  preferred: string;
}

class ThreeDSecureUsage {
  @IsBoolean()
  supported: boolean;
}

class Card {
  @IsString()
  brand: string;

  @ValidateNested()
  @Type(() => Checks)
  checks: Checks;

  @IsString()
  country: string;

  @IsString()
  display_brand: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  exp_year: number;

  @IsString()
  funding: string;

  @IsOptional()
  generated_from: any;

  @IsString()
  last4: string;

  @ValidateNested()
  @Type(() => Networks)
  networks: Networks;

  @ValidateNested()
  @Type(() => ThreeDSecureUsage)
  three_d_secure_usage: ThreeDSecureUsage;

  @IsOptional()
  wallet: any;
}

export class StripePaymentMethodDTO {
  @IsString()
  id: string;

  @IsString()
  object: string;

  @IsString()
  allow_redisplay: string;

  @ValidateNested()
  @Type(() => BillingDetails)
  billing_details: BillingDetails;

  @ValidateNested()
  @Type(() => Card)
  card: Card;

  @IsNumber()
  created: number;

  @IsOptional()
  customer: any;

  @IsBoolean()
  livemode: boolean;

  @IsObject()
  radar_options: any;

  @IsString()
  type: string;
}
