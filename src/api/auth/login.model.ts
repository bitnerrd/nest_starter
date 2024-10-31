import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { ArrayMaxSize, IsArray } from "class-validator";
import mongoose, { Document, now } from "mongoose";
export type LoginDocument = Document & Login;
@Schema({
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret.password;
      delete ret.otp;
      delete ret.isLocked;
      delete ret.lockUntil;
      delete ret.attempts;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      delete ret.verifyToken;
      delete ret.refreshToken;
      delete ret.accessTokens;
      delete ret.stripeCustomerId;
      delete ret.verifyTokenExpires;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
})
export class Login {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User",
    index: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  email: string; // Yes

  @Prop({ required: true })
  password: string; // Yes

  @Prop({ enum: ["user", "admin"], required: true, default: "user" })
  role: string; // Yes

  @Prop({ default: null })
  otp: number; // Yes

  @Prop({ default: false })
  isLocked: boolean; // Yes

  @Prop()
  lockUntil: Date; // Yes

  @Prop({ default: false })
  verified: boolean; // Yes

  @Prop({ default: 0 })
  attempts: number; // Yes

  @Prop({ default: null })
  resetPasswordToken: string; // Yes

  @Prop()
  stripeCustomerId: string; // Yes

  @Prop({ default: null })
  resetPasswordExpires: Date; // Yes

  @Prop({ default: null })
  verifyToken: string; // Yes

  @Prop({ default: null })
  verifyTokenExpires: Date; // Yes

  @Prop()
  @IsArray()
  @ArrayMaxSize(2, {
    message: "TraderMetrix allows only 2 Simultaneous sessions.",
  })
  accessTokens: string[]; // Yes

  @Prop()
  refreshToken: string; // Yes

  @Prop({ required: true, enum: ["google", "email"] })
  provider: string; // Yes
}

export const LoginModel = SchemaFactory.createForClass(Login);

LoginModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

LoginModel.virtual("profile", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export enum FailedLogins {
  NOT_FOUND,
  ACCOUNT_LOCKED,
  MAX_ATTEMPTS = 5,
}
