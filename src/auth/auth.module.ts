import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './helpers/auth.helper';
import { TokenService } from './token/token.service';
import { SecurityCodeService } from './security-code/security-code.service';
import { AuthConfig } from './config/auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<AuthConfig>('auth').accessToken.secret,
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
    MailModule,
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthHelper,
    AuthService,
    JwtStrategy,
    TokenService,
    SecurityCodeService
  ],
  exports: [AuthHelper, JwtModule]
})
export class AuthModule { }
