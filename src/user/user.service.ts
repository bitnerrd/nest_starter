import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserEntity } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authHelper: AuthHelper,
  ) {
    super(userRepository);
  }

  async updateUser(id: string, updateDto: UpdateUserDto) {
    if (updateDto.firstName && updateDto.lastName) {
      updateDto.fullName = `${updateDto.firstName} ${updateDto.lastName}`;
    }

    if (updateDto.password)
      updateDto.password = await this.authHelper.hashPassword(
        updateDto.password,
      );

    const { ...rest } = updateDto;
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id })
      .execute();

    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    return user;
  }
}
