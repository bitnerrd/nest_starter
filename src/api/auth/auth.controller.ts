import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthenticatedRequest } from "src/common/interfaces/request";

import {
  ForgetPasswordDTO,
  LoginDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  SignupDTO,
  VerifyOTPDTO,
} from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { ChangePasswordDTO } from "../user/user.dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private authServices: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    const response = await this.authServices.login(body);
    return response;
  }

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignupDTO) {
    const user = await this.authServices.signup(body);
    return user;
  }

  @Post("signup-verif")
  @HttpCode(HttpStatus.OK)
  async resendSignUpVerificationMail(@Body() body: ResendOtpDTO) {
    const response = await this.authServices.resendVerificationLink(body.email);
    return response;
  }

  @Post("user-verified/:encodedString")
  @HttpCode(HttpStatus.OK)
  async userVerified(@Param("encodedString") encodedString: string) {
    const response = await this.authServices.userVerified(encodedString);
    return response;
  }

  @Get("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async logoutSession(@Req() req: AuthenticatedRequest) {
    const user = req.auth.user;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1]; // Split on

    const logout = await this.authServices.logoutSession(user, token);
    return logout;
  }

  @Post("update-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async passwordUpdate(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDTO
  ) {
    const response = await this.authServices.passwordUpdate({
      user: req.auth.user,
      payload: body,
    });

    return response;
  }

  @Post("forget-password")
  @HttpCode(HttpStatus.OK)
  async forgetPassword(
    @Body() body: ForgetPasswordDTO,
    @Query("type") type: string
  ) {
    const response = await this.authServices.forgetPassword(body, type);
    return response;
  }

  @Get("verify-link/:encodedString")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ deprecated: true })
  async verifyLink(@Param("encodedString") encodedString: string) {
    const response = await this.authServices.verifyLink(encodedString);
    return response;
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDTO) {
    const response = await this.authServices.resetPassword(body);
    return response;
  }

  @Post("resend-otp")
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() body: ResendOtpDTO, @Query("type") type: string) {
    const response = await this.authServices.resendOTP(body, type);
    return response;
  }

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verifyPasswordResetOTP(@Body() body: VerifyOTPDTO) {
    const { email, otp } = body;
    const response = await this.authServices.verifyPasswordResetOTP({
      email,
      otp,
    });
    return response;
  }
}
