import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthHelper {
  async hashPassword(pass: string, rounds = 8) {
    return bcrypt.hashSync(pass, rounds);
  }

  matchPassword(pass: string, hash: string, _round = 10) {
    return bcrypt.compareSync(pass, hash);
  }
}
