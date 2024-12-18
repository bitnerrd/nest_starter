import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, MailService]
})
export class UserModule { }
