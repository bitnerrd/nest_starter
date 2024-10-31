import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Login, LoginModel } from "src/api/auth/login.model";
import { SocketConnection } from "./connection";
import { AuthService } from "../auth/auth.service";
import { Payment, PaymentModel } from "../stripe/stripe.model";
import { User, UserModel } from "../user/models/user.model";
import { Server } from "socket.io";
import { SocketEmitter } from "./socket.emitters";
import { UserServices } from "../user/user.service";
import {
  NotificationModel,
  Notifications,
} from "../user/models/notification.model";
import { History, HistoryModel } from "../user/models/history.model";

@Module({
  providers: [
    SocketConnection,
    AuthService,
    // TradesService,
    UserServices,
    {
      provide: "SOCKET_SERVER",
      useFactory: () => {
        return new Server();
      },
    },
    {
      provide: SocketEmitter,
      useFactory: (server: Server) => new SocketEmitter(server),
      inject: ["SOCKET_SERVER"],
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentModel },
      { name: User.name, schema: UserModel },
      { name: Login.name, schema: LoginModel },
      { name: Notifications.name, schema: NotificationModel },
    ]),
  ],
  exports: [SocketEmitter],
})
export class GatewayModule {}
