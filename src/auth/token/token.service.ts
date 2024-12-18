import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user/user.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthConfig } from '../config/auth.config';
import { AccessToken, RefreshToken, TokenType } from './token';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  private readonly authConfig: AuthConfig;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  async generateToken(user: UserEntity): Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);
    return { accessToken, refreshToken };
  }

  private async generateAccessToken(user: UserEntity): Promise<string> {
    const accessToken: AccessToken = {
      email: user.email,
      user: this.mapUserToSimpleUser(user),
    };
    return this.jwtService.sign(accessToken, {
      ...this.getConfig('accessToken'),
      subject: user.id,
    });
  }

  private async generateRefreshToken(user: UserEntity): Promise<string> {
    const randomUuid = randomUUID();
    const refreshToken: RefreshToken = {
      rid: randomUuid,
    };

    this.userRepository.update(
      {
        id: user.id,
      },
      {
        refreshTokenId: randomUuid,
      },
    );

    return await this.jwtService.signAsync(refreshToken, {
      ...this.getConfig('refreshToken'),
      subject: user.id,
    });
  }

  private mapUserToSimpleUser(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
    };
  }

  private getConfig(type: TokenType): JwtSignOptions {
    return {
      secret: this.authConfig[type].secret,
      expiresIn: this.authConfig[type].expiration,
      // algorithm: 'HS256',
    };
  }
}
