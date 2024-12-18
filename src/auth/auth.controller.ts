import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login account' })
  public async login(@Body() loginDto: AuthEmailLoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myProfile(@Request() req) {
    return this.authService.myProfile(req.user_id);
  }
}
