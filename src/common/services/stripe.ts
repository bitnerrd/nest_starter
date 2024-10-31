import Stripe from "stripe";
import { UpdatePaymentMethodDTO } from "src/api/stripe/dto/stripe.dto";
import * as dotenv from "dotenv";

dotenv.config();
export class StripeServices {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-04-10",
    });
  }

  // ? Create a customer on stripe
  async createStripeCustomer(name: string, email: string) {
    const customer = await this.stripe.customers.create({
      name,
      email,
    });
    return customer;
  }

  // ? attach payment method to customer
  async attachPaymentMethod({
    customerId,
    paymentMethodId,
  }: {
    customerId: string;
    paymentMethodId: string;
  }) {
    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: customerId,
      }
    );
    return paymentMethod;
  }

  // ? Detach payment method from customer
  async detachPaymentMethod({
    paymentMethodId,
    customerId,
  }: {
    paymentMethodId: string;
    customerId?: string;
  }) {
    const detach = await this.stripe.paymentMethods.detach(paymentMethodId);
    return detach;
  }

  async updatePaymentMethod({
    paymentMethodId,
    payload,
  }: {
    paymentMethodId: string;
    payload: UpdatePaymentMethodDTO;
  }) {
    const updated = await stripeServicesInstance.stripe.paymentMethods.update(
      paymentMethodId,
      {
        billing_details: {
          address: {
            city: payload.city,
            country: payload.country,
            line1: payload.line1,
            postal_code: payload.postalCode,
            state: payload.state,
          },
        },
        card: {
          exp_month: payload.expMonth,
          exp_year: payload.expYear,
        },
      }
    );
    return updated;
  }

  // ? Charge User 1, create payment intent and confirm that intent
  async chargePaymentMethod({
    customerId,
    paymentMethodId,
    amount,
    description,
    currency,
  }: {
    customerId: string;
    paymentMethodId: string;
    amount: number;
    description: string;
    currency: string;
  }) {
    const intent = await stripeServicesInstance.stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customerId,
      description: description,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    return intent;
  }

  // ? Retrive all PaymentMethods
  async listCustomerPaymentMethods(customerId: string) {
    const list = await this.stripe.customers.listPaymentMethods(customerId);
    return list;
  }

  // ? find user Payment Method

  async getCustomerPaymentMethod(customerId, paymentMethodId) {
    const method = await this.stripe.customers.retrievePaymentMethod(
      customerId,
      paymentMethodId
    );
    return method;
  }
}

export const stripeServicesInstance = new StripeServices();
