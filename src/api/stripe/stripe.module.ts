import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Payment, PaymentModel } from "./stripe.model";
import { AuthService } from "../auth/auth.service";
import { Login, LoginModel } from "../auth/login.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentModel },
      { name: Login.name, schema: LoginModel },
    ]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
