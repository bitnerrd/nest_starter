import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  Req,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { EmailExistDto } from './dtos/email-exist.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token/refresh-token.guard';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
@Controller('auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Register yourself to create pitch' })
  public async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('email-exist')
  @ApiOperation({ summary: 'Check email already exists on platform or not' })
  public async emailExist(@Body() emailExistDto: EmailExistDto): Promise<any> {
    return await this.authService.checkEmailExist(emailExistDto.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login account' })
  public async login(@Body() loginDto: AuthEmailLoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }

  @Get('verify-reset-password-code')
  async verifyResetPasswordCode(@Query('code') code: string) {
    return await this.authService.verifyResetPasswordCode(code);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() body: AuthResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  @ApiOperation({ summary: 'Get new access token' })
  async refreshTokens(@Req() { rid }) {
    return this.authService.refreshTokens(rid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myProfile(@Request() req) {
    return this.authService.myProfile(req.user.id);
  }

  @Post('add-admin')
  async addAdmin(@Body() signUpDto: SignUpDto) {
    return this.authService.addAdmin(signUpDto);
  }
}
