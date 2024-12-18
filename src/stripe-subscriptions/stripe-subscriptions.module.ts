import { Module } from '@nestjs/common';
import { StripeSubscriptionsService } from './stripe-subscriptions.service';

@Module({
  providers: [StripeSubscriptionsService],
  exports: [StripeSubscriptionsService]
})
export class StripeSubscriptionsModule { }
