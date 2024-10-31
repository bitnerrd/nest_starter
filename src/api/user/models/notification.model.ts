import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
@Schema({
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
  timestamps: true,
})
export class Notifications {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false, default: false })
  seen: boolean;
}

export const NotificationModel = SchemaFactory.createForClass(Notifications);
