import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './accounts/account.entity';

/**
 * ? Note: define all of your entities in this array
 */
const entitiesArr = [TypeOrmModule.forFeature([AccountEntity])];

@Global()
@Module({
  imports: [...entitiesArr],
  exports: [...entitiesArr],
})
export class EntitiesModule {}
