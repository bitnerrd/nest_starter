import { IsNumber, IsString } from "class-validator";

export class DetachPmDTO {
  @IsString()
  paymentMethodId: string;
}

export class UpdatePaymentMethodDTO {
  @IsString()
  name: string;

  @IsString()
  line1: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsNumber()
  expMonth: number;

  @IsNumber()
  expYear: number;
}
