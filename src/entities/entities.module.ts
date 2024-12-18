import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';

/**
 * ? Note: define all of your entities in this array
 */
const entitiesArr = [TypeOrmModule.forFeature([UserEntity])];

@Global()
@Module({
  imports: [...entitiesArr],
  exports: [...entitiesArr],
})
export class EntitiesModule {}
