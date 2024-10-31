import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
@Schema({
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
  timestamps: true,
})
export class User {
  // // Add loginId as a reference to the Login schema
  // @Prop({ type: Types.ObjectId, ref: "Login" })
  // loginId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: number;

  @Prop()
  country: string;

  @Prop()
  timezone: string;

  @Prop()
  dateFormat: string;

  @Prop()
  language: string;

  @Prop({ enum: ["user", "admin"], required: true, default: "user" })
  role: string;

  @Prop()
  profilePicture: string;

  @Prop()
  coverPicture: string;
}

export const UserModel = SchemaFactory.createForClass(User);
