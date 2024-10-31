import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { Login } from "../login.model";
import { Model } from "mongoose";
import { jwt } from "src/common/utils/jwt";
import { IUser } from "src/common/interfaces/user.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(Login.name) public Login: Model<Login>) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user = await jwt.verifyAccessToken({
        token: token,
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });

      const data: IUser = await this.Login.findById(user._id)
        .populate("profile")
        .lean();

      console.log(
        `${new Date().toLocaleTimeString()} - Method: ${request.method}, URL: ${request.url}`
          .blue.bold
      );

      request["auth"] = { user: data };

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
