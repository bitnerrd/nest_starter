import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/entities/user/user.entity';
import { SecurityCodeTypeEnum } from 'src/utils/enums/enums';

@Injectable()
export class AuthHelper {
  async hashPassword(pass: string, rounds = 8) {
    return bcrypt.hashSync(pass, rounds);
  }

  matchPassword(pass: string, hash: string, _round = 10) {
    return bcrypt.compareSync(pass, hash);
  }
}
