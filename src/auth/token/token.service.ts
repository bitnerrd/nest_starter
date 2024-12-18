import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/accounts/account.entity';
import { Repository } from 'typeorm';
import { AuthConfig } from '../config/auth.config';
import { AccessToken, TokenType } from './token';

@Injectable()
export class TokenService {
  private readonly authConfig: AuthConfig;

  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  async generateToken(user: AccountEntity) {
    const [accessToken] = await Promise.all([this.generateAccessToken(user)]);
    return { accessToken };
  }

  private async generateAccessToken(
    user: Partial<AccountEntity>,
  ): Promise<string> {
    const accessToken: AccessToken = {
      email: user.email,
    };
    return this.jwtService.sign(accessToken, {
      ...this.getConfig('accessToken'),
      subject: user.id,
    });
  }

  private getConfig(type: TokenType): JwtSignOptions {
    return {
      secret: this.authConfig[type].secret,
      expiresIn: this.authConfig[type].expiration,
      // algorithm: 'HS256',
    };
  }
}
