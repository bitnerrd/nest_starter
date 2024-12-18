import { Module } from '@nestjs/common';
import { StripeSetupIntentService } from './stripe-setup-intent.service';
import { StripeSetupIntentController } from './stripe-setup-intent.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StripeSetupIntentController],
  providers: [StripeSetupIntentService]
})
export class StripeSetupIntentModule { }
