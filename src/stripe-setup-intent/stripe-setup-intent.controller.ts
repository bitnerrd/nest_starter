import { Body, Controller, Get, Post, Query, Req, Session, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { StripeSetupIntentService } from './stripe-setup-intent.service';
import { CheckoutDto } from './dtos/checkout.dto';


@ApiTags('Stripe Setup Intent')
@Controller({
  path: 'stripe-setup-intent',
  version: '1',
})
export class StripeSetupIntentController {
  constructor(private readonly stripeSetupIntentService: StripeSetupIntentService) { }

  @Post('/create-checkout-session')
  async checkoutSession(@Body() dto: CheckoutDto) {
    return await this.stripeSetupIntentService.checkoutSession(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async clientSecret(@Session() session: Record<string, any>, @Req() { user }, @Query() force: boolean) {
    return await this.stripeSetupIntentService.createSetupIntent(user, session, force)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async paymentIntentSuccess(@Req() { user }) {
    return await this.stripeSetupIntentService.paymentIntentSuccess(user)
  }
}
