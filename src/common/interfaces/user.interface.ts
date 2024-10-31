import { ObjectId } from "mongoose";

export interface IProfile {
  _id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  phone: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  profilePicture: string;
}

export interface IUser {
  _id: ObjectId;
  userId: ObjectId;
  email: string;
  password: string;
  role: string;
  otp: any;
  isLocked: boolean;
  verified: boolean;
  attempts: number;
  resetPasswordToken: any;
  resetPasswordExpires: any;
  verifyToken: any;
  verifyTokenExpires: any;
  accessTokens: string[];
  provider: string;
  stripeCustomerId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  refreshToken: string;
  profile: IProfile;
}
