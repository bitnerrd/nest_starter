import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Login, LoginModel } from "../auth/login.model";
import { UserController } from "./user.controller";
import { UserServices } from "./user.service";
import { ScheduleModule } from "@nestjs/schedule";
import { User, UserModel } from "./models/user.model";
import { NotificationModel, Notifications } from "./models/notification.model";

@Module({
  controllers: [UserController],
  providers: [UserServices],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginModel },
      { name: User.name, schema: UserModel },
      { name: Notifications.name, schema: NotificationModel },
    ]),
  ],
  exports: [UserServices],
})
export class UserModule {}
