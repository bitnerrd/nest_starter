import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { AuthenticatedRequest } from "src/common/interfaces/request";
import { AuthGuard } from "../auth/guards/auth.guard";
import { StripePaymentMethodDTO } from "./dto/stripe.pm.dto";
import { DetachPmDTO, UpdatePaymentMethodDTO } from "./dto/stripe.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IUser } from "src/common/interfaces/user.interface";

@Controller("stripe")
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags("Stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // save and attach card
  @Post("attach")
  @HttpCode(HttpStatus.CREATED)
  async attachCard(
    @Req() req: AuthenticatedRequest,
    @Body() body: StripePaymentMethodDTO
  ) {
    const user: IUser = req.auth.user;
    return await this.stripeService.attachCard(user, body);
  }

  // deatch and remove card
  @Post("de-attach")
  @HttpCode(HttpStatus.OK)
  async detachCard(
    @Req() req: AuthenticatedRequest,
    @Body() body: DetachPmDTO
  ) {
    const user = req.auth.user;
    return await this.stripeService.detachCard(user, body);
  }

  @Post("update-method/:paymentMethodId")
  @HttpCode(HttpStatus.OK)
  async updateCard(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdatePaymentMethodDTO,
    @Param("paymentMethodId") paymentMethodId: string
  ) {
    const user = req.auth.user;
    return await this.stripeService.updateCard(user, paymentMethodId, body);
  }
}
