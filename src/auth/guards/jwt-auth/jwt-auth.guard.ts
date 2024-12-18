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
// import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    // private readonly authHelper: AuthHelper,
    private readonly jwtService: JwtService,
  ) {
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

      if (!payload.user.isActive) {
        throw new HttpException(
          MESSAGE_CONSTANTS.incorrectEmailOrPassword,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      req.user = payload.user;
      return payload && req.user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
