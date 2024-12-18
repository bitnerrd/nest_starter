import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { MESSAGE_CONSTANTS } from 'src/utils/constants/messages-constants';
// import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') {
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
                throw new HttpException('jwt Service not found', HttpStatus.INTERNAL_SERVER_ERROR)
            }
            const payload = this.jwtService.decode(token);
            if (!payload['rid']) {
                console.log('thrown from here')
                throw new HttpException(MESSAGE_CONSTANTS.invalidToken, HttpStatus.NOT_ACCEPTABLE)
            }
            // const isBlackListed = await this.authHelper.isTokenBlackListed(token);
            req.rid = payload['rid'];
            return payload && req.rid;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
        }
    }
}
