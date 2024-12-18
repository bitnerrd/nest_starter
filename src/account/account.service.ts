import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { AccountEntity } from 'src/entities/accounts/account.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/ create.account.dto';
import { UpdateUserDto } from './dtos/update.account.dto';

export class PaginationDto {
  page?: number = 1;
  limit?: number = 10;
  sortBy?: string = 'createdAt';
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    private authHelper: AuthHelper,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = await this.accountRepository.create(createAccountDto);
    account.password = await this.authHelper.hashPassword(account.password);
    return this.accountRepository.save(account);
  }

  async findAll(options: PaginationDto = {}): Promise<{
    data: AccountEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = options;

    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<AccountEntity> = {
      take: limit,
      skip: skip,
      order: {
        [sortBy]: sortOrder,
      },
    };

    const [data, total] = await this.accountRepository.findAndCount(
      findOptions,
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async remove(id: string) {
    const result = await this.accountRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
  }

  async update(id: string, updateDto: UpdateUserDto) {
    if (updateDto.password)
      updateDto.password = await this.authHelper.hashPassword(
        updateDto.password,
      );

    const { ...rest } = updateDto;
    await this.accountRepository.update(id, rest);

    const user = await this.accountRepository.findOne({
      where: { id: id },
    });
    return user;
  }
}
