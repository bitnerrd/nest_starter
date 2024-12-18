import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { UserService } from './account.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AccountController],
  providers: [UserService],
})
export class AccountModule {}
