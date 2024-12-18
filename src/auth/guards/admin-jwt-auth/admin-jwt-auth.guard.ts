import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { MESSAGE_CONSTANTS } from 'src/utils/constants/messages-constants';
import { RoleEnum } from 'src/utils/enums/enums';
// import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const req = context.switchToHttp().getRequest();
      const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        throw new Error(MESSAGE_CONSTANTS.invalidToken);
      }
      if (!this.jwtService) {
        throw new HttpException(
          'jwt Service not found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const payload = await this.jwtService.verify(token);
      if (payload.user.role !== RoleEnum.admin) {
        throw new HttpException(
          MESSAGE_CONSTANTS.invalidToken,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      // const isBlackListed = await this.authHelper.isTokenBlackListed(token);
      req.admin = payload.user;
      return payload && req.admin;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
