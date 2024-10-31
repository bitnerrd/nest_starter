import { HttpException } from "@nestjs/common";
import { IProfile, IUser } from "./user.interface";

export interface AuthenticatedRequest extends Request {
  auth: {
    user: IUser;
  };
  headers: any;
}
