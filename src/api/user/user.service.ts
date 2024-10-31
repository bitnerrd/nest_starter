import { faker } from "@faker-js/faker";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { promises as fs } from "fs";
import * as moment from "moment";
import { Model } from "mongoose";
import { join } from "path";
import { Login } from "../auth/login.model";
import { UserProfileUpdateDTO } from "./user.dto";
import { User } from "./models/user.model";
import { IUser } from "src/common/interfaces/user.interface";
import { Notifications } from "./models/notification.model";
import { SocketCommands } from "../socket/socket.interfaces";

@Injectable()
export class UserServices {
  constructor(
    @InjectModel(Login.name) public Login: Model<Login>,
    @InjectModel(User.name) public User: Model<User>,
    @InjectModel(Notifications.name) private Notification: Model<Notifications>
  ) {}

  async updateProfile(user: IUser, payload: UserProfileUpdateDTO) {
    const forbiddenProperties = [
      "role",
      "availableCredits",
      "isLocked",
      "attempts",
      "verified",
    ];

    if (forbiddenProperties.some((prop) => prop in payload)) {
      if (user.profile.role !== "admin") {
        throw new Error("Forbidden Resource");
      }
    }

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );

    const updateResult: any = await this.User.findByIdAndUpdate(
      user.profile._id,
      { $set: cleanPayload },
      { new: true }
    );

    if (!updateResult) {
      throw new Error("User not found or data not updated");
    } else {
      const data = JSON.parse(JSON.stringify(updateResult));
      return {
        ...data,
        ApiMessage: "Profile Updated Successfully",
        status: HttpStatus.OK,
      };
    }
  }

  async returnUser(user: any) {
    const data = user.profile;
    return {
      ...data,
      ApiMessage: "user retrived",
    };
  }

  async getNotifications(user: IUser) {
    const notifications = await this.Notification.find({
      userId: user.profile._id,
    }).sort({ createdAt: -1 });
    return notifications;
  }

  async seenNotification(user: IUser, notificationId: string) {
    const notification = await this.Notification.findOneAndUpdate(
      { _id: notificationId, userId: user.profile._id },
      { $set: { seen: true } },
      { new: true }
    );
    return notification;
  }

  async getNotificationsCount(user: IUser) {
    const notifiCount = await this.Notification.find({
      userId: user.profile._id,
      seen: false,
    }).countDocuments();

    return {
      COMMAND: SocketCommands.NOTIFICATIONS_COUNT,
      unSeenNotifications: notifiCount,
    };
  }

  // upload files and images to server
  async saveUploadedFile(file: Express.Multer.File) {
    const uploadDir = join(process.cwd(), "public", "uploads");
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = join(uploadDir, fileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);
    return `public/uploads/${fileName}`;
  }

  // Cron job for removing unverified users after 48 hours

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async deleteUnverifiedUsers() {
  //   try {
  //     const now = moment();
  //     const threshold = now.subtract(48, "hours").toDate();

  //     await this.Login.deleteMany({
  //       verified: false,
  //       createdAt: { $lt: threshold },
  //     });

  //     console.log("Deleted unverified users created before:", threshold);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
