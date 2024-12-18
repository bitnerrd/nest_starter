import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class SimpleUser {
  @ApiProperty({ nullable: true })
  firstName: string | null;

  @ApiProperty({ nullable: true })
  lastName: string | null;  

  @ApiProperty({ nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ nullable: true })
  email: string | null;

  @ApiProperty({ nullable: true })
  role: string | null;

  @ApiProperty({ nullable: true })
  profilePic?: string | null;
}

export type TokenType = 'accessToken' | 'refreshToken';

export interface IToken {
  user: SimpleUser;
  email: string | null;
}

export class RefreshToken {
  @ApiProperty()
  rid: string;
}

export class AccessToken implements IToken {
  @ApiProperty({ type: () => SimpleUser })
  user: SimpleUser;

  @ApiProperty()
  email: string | null;
}

@ApiExtraModels(RefreshToken, AccessToken)
export class TokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
