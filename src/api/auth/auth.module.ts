import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Login, LoginModel } from "./login.model";
import { Payment, PaymentModel } from "../stripe/stripe.model";
import { User, UserModel } from "../user/models/user.model";
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginModel },
      { name: Payment.name, schema: PaymentModel },
      { name: User.name, schema: UserModel },
    ]),
    JwtModule.register({
      global: true,
      secret: JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: "60d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
