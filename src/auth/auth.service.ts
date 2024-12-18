import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/entities/user/user.entity';
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
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
          fullName: `${dto.firstName} ${dto.lastName}`,
        }),
      );

      const tokens = await this.tokenService.generateToken(userCreated);

      userCreated['tokens'] = tokens;
      return {
        data: userCreated,
        message: MESSAGE_CONSTANTS.verificationEmailIsSentToYourEmail,
      };
    } catch (error) {
      throw new HttpException(
        error.message || MESSAGE_CONSTANTS.somethingWentWrong,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addAdmin(dto: any) {
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
          role: RoleEnum.admin,
        }),
      );

      return { message: 'Your account has been created' };
    } catch (error) {
      throw new HttpException(
        error.message || MESSAGE_CONSTANTS.somethingWentWrong,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkEmailExist(email: string) {
    const findEmail = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    return findEmail ? true : false;
  }

  public async login(loginDto: AuthEmailLoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
        // role: RoleEnum.user
      },
      relations: ['profilePic'],
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

    if (user && user.role === RoleEnum.user && !user.isActive)
      throw new HttpException(
        MESSAGE_CONSTANTS.incorrectEmailOrPassword,
        HttpStatus.NOT_ACCEPTABLE,
      );

    const tokens = await this.tokenService.generateToken(user);
    await user.save();
    return { user, tokens };
  }

  async verifyResetPasswordCode(code: string) {}

  async resetPassword(body: AuthResetPasswordDto) {}

  async refreshTokens(rid: string) {
    try {
      const userWithRidExists = await this.usersRepository.findOne({
        where: { refreshTokenId: rid },
      });

      if (!userWithRidExists) {
        throw new HttpException(
          MESSAGE_CONSTANTS.invalidToken,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const newRid = randomUUID();
      await this.usersRepository.update(
        { id: userWithRidExists.id },
        { refreshTokenId: newRid },
      );

      const tokens = await this.tokenService.generateToken(userWithRidExists);

      return { user: userWithRidExists, tokens };
    } catch (error) {
      throw new HttpException(
        error.message || MESSAGE_CONSTANTS.somethingWentWrong,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async myProfile(id: string) {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: [
        'availability_days',
        'availability_days.day',
        'availability_slots',
        'availability_slots.timeSlot',
        'otherDocuments',
        'profilePic',
        'pitchDeck',
        'businessPlan',
      ],
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
