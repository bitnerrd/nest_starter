import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({
  timestamps: true,
  virtuals: true,
})
export class Payment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Login" })
  userId: string;

  @Prop()
  stripeCustomerId: string;

  @Prop()
  primaryMethodId: string;

  @Prop()
  paymentMethods: [];
}

export const PaymentModel = SchemaFactory.createForClass(Payment);
