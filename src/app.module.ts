import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./api/auth/auth.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
// Contains all modules related to the admin
import { Exception } from "./common/middlewares/exception";
import { GatewayModule } from "./api/socket/socket.module";
import { StripeModule } from "./api/stripe/stripe.module";
import { UserModule } from "./api/user/user.module";
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "client", "dist"),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    GatewayModule,
    StripeModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR, // Global interceptor for Response handling
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER, // Global Exception Filter for handling exceptions
      useClass: Exception,
    },
    {
      provide: APP_PIPE, // Global Validation Pipe for handling Request data validation
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

// hello i am from call of duty
