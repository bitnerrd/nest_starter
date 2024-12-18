import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { AccountEntity } from 'src/entities/accounts/account.entity';
import { MESSAGE_CONSTANTS } from 'src/utils/constants/messages-constants';
import { RoleEnum } from 'src/utils/enums/enums';
import { Repository } from 'typeorm';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthHelper } from './helpers/auth.helper';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly usersRepository: Repository<AccountEntity>,
    private readonly authHelper: AuthHelper,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto) {
    try {
      const userExist = await this.usersRepository.findOne({
        where: { email: dto.email },
      });
      if (userExist) {
        throw new HttpException(
          MESSAGE_CONSTANTS.emailAlreadyExist,
          HttpStatus.BAD_REQUEST,
        );
      }

      const userCreated = await this.usersRepository.save(
        this.usersRepository.create({
          email: dto.email,
          password: await this.authHelper.hashPassword(dto.password),
          phoneNumber: dto.phoneNumber,
          firstName: dto.firstName,
          lastName: dto.lastName,
        }),
      );

      const tokens = await this.tokenService.generateToken(userCreated);

      userCreated['tokens'] = tokens;
      return {
        data: userCreated,
        message: MESSAGE_CONSTANTS.accountCreated,
      };
    } catch (error) {
      throw new HttpException(
        error.message || MESSAGE_CONSTANTS.somethingWentWrong,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(loginDto: AuthEmailLoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (
      !user ||
      !this.authHelper.matchPassword(loginDto.password, user.password)
    ) {
      throw new HttpException(
        MESSAGE_CONSTANTS.incorrectEmailOrPassword,
        HttpStatus.NOT_FOUND,
      );
    }

    const tokens = await this.tokenService.generateToken(user);
    await user.save();
    return { user, tokens };
  }

  async myProfile(id: string) {
    return await this.usersRepository.findOne({
      where: { id: id },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && this.authHelper.matchPassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
