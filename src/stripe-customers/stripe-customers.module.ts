import { Module } from '@nestjs/common';
import { CreateCustomerOnStripeHandler } from './cqrs/handlers/create-customer-on-stripe.handler';
import { StripeCustomersService } from './stripe-customers.service';

@Module({
  providers: [
    StripeCustomersService,
    CreateCustomerOnStripeHandler
  ]
})
export class StripeCustomersModule { }
