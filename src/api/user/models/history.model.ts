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
export class History {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
    required: false,
  })
  portfolioId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: false })
  fileName: string;

  @Prop({ required: false })
  fileId: number;

  @Prop({ required: false })
  broker: string;

  @Prop({ required: false })
  fileTradesCount: number;

  @Prop({ required: false })
  fileBrokerName: string;

  @Prop({ required: false, enum: ["success", "deleted"] })
  fileStatus: string;
}

export const HistoryModel = SchemaFactory.createForClass(History);

export enum FileStatus {
  SUCCESS = "success",
  DELETED = "deleted",
}
