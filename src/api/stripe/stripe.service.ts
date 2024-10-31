import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "./stripe.model";
import { Login } from "../auth/login.model";
import { Model } from "mongoose";
import { stripeServicesInstance } from "src/common/services/stripe";
import { StripePaymentMethodDTO } from "./dto/stripe.pm.dto";
import { DetachPmDTO, UpdatePaymentMethodDTO } from "./dto/stripe.dto";
import { IUser } from "src/common/interfaces/user.interface";

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(Payment.name) public PaymentModel: Model<Payment>,
    @InjectModel(Login.name) public Login: Model<Login>
  ) {}

  // attach card to stripe customer
  async attachCard(user: IUser, payload: StripePaymentMethodDTO) {
    const bankInfo = await this.PaymentModel.findOne({
      userId: user.profile._id,
    });

    if (!bankInfo) {
      throw new NotFoundException("Failed fetch payment details!");
    }

    const paymentMethods = bankInfo.paymentMethods;
    paymentMethods.map((el: StripePaymentMethodDTO) => {
      if (el.id == payload.id) {
        throw new ConflictException("This Payment Method is already attached");
      }
    });
    const customerId = bankInfo.stripeCustomerId;
    const paymentMethodId = payload.id;

    try {
      await stripeServicesInstance.attachPaymentMethod({
        customerId,
        paymentMethodId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    await this.PaymentModel.findOneAndUpdate(
      { userId: user.profile._id },
      {
        $push: { paymentMethods: payload },
        $set: { primaryMethodId: paymentMethodId },
      },
      { new: true }
    );
    return {
      ApiMessage: "Card attached Successfully",
      status: HttpStatus.CREATED,
    };
  }

  // Detach card from stripe as well as remove from stripe
  async detachCard(user: IUser, payload: DetachPmDTO) {
    const bankInfo = await this.PaymentModel.findOne({
      userId: user.profile._id,
    });

    if (!bankInfo) {
      throw new InternalServerErrorException("Failed to fetch payment methods");
    }

    const availableMethods = bankInfo.paymentMethods;

    const isMethodAvailable = availableMethods.some(
      (el: StripePaymentMethodDTO) => el.id === payload.paymentMethodId
    );

    if (!isMethodAvailable) {
      throw new NotFoundException("Payment method not found");
    }

    try {
      await stripeServicesInstance.detachPaymentMethod({
        paymentMethodId: payload.paymentMethodId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    await this.PaymentModel.findOneAndUpdate(
      { userId: user.profile._id },
      { $pull: { paymentMethods: { id: payload.paymentMethodId } } },
      { new: true }
    );

    return {
      ApiMessage: "Card Removed Successfully",
      status: HttpStatus.OK,
    };
  }

  // update card information from db as well as stripe
  async updateCard(
    user: IUser,
    paymentMethodId: string,
    payload: UpdatePaymentMethodDTO
  ) {
    const bankInfo = await this.PaymentModel.findOne({
      userId: user.profile._id,
    });
    const customerId = bankInfo.stripeCustomerId;

    // Check if the payment method exists for the customer
    const paymentMethod = await stripeServicesInstance.getCustomerPaymentMethod(
      customerId,
      paymentMethodId
    );
    let updatedMethod;
    if (paymentMethod && paymentMethod.customer === customerId) {
      updatedMethod = await stripeServicesInstance.updatePaymentMethod({
        paymentMethodId: paymentMethodId,
        payload: payload,
      });

      // Remove the existing payment method from the array
      await this.PaymentModel.updateOne(
        { userId: user.profile._id },
        { $pull: { paymentMethods: { id: paymentMethodId } } }
      );

      await this.PaymentModel.updateOne(
        { userId: user.profile._id },
        { $addToSet: { paymentMethods: updatedMethod } }
      );
    }

    return {
      ApiMessage: "Payment method updated",
      status: HttpStatus.OK,
    };
  }
}
