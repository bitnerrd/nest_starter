import { JwtService } from "@nestjs/jwt";

class JWT_SERVICE {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async generateAccessToken(userId: string, expiresIn: string) {
    const token = await this.jwtService.signAsync(
      {
        _id: userId,
      },
      {
        expiresIn: expiresIn,
      }
    );
    return token;
  }

  async generateRefreshToken(user, expiresIn: string) {
    const payload = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: expiresIn,
    });
    return refreshToken;
  }

  async verifyAccessToken({
    token,
    secret,
  }: {
    token: string;
    secret: string;
  }) {
    try {
      return await this.jwtService.verifyAsync(token, { secret: secret });
    } catch (error) {
      return null;
    }
  }
}

export const jwt = new JWT_SERVICE();
