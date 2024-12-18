import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';


@ApiTags('Webhooks')
@Controller({
  path: 'webhooks',
  version: '1',
})
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Post('setup-intent-status')
  async stripeSetupIntentWebhook(@Body() stripePayload: any) {
    return await this.webhooksService.checkStripeSetupIntentStatus(stripePayload)
  }
}
