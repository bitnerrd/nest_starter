import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/entities/user/user.entity';
import { CreateCustomerOnStripeEvent } from 'src/stripe-customers/cqrs/events/create-customer-on-stripe.event';
import { MESSAGE_CONSTANTS } from 'src/utils/constants/messages-constants';
import { RoleEnum, SecurityCodeTypeEnum } from 'src/utils/enums/enums';
import { CreateUserOnZoomEvent } from 'src/zoom/cqrs/events/create-user-on-zoom.event';
import { Repository } from 'typeorm';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthHelper } from './helpers/auth.helper';
import { SecurityCodeService } from './security-code/security-code.service';
import { TokenService } from './token/token.service';
import { SubAdminPermissionsDto } from './dtos/sub-admin-permissions.dto';
import { AddSubAdminDto } from './dtos/sub-admin.dto';
import { SubAdminPermissionsEntity } from 'src/entities/sub-admin-permissions/sub-admin-permission.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly authHelper: AuthHelper,
        private readonly tokenService: TokenService,
        private readonly securityCodeService: SecurityCodeService,
        private eventBus: EventBus,
        @InjectRepository(SubAdminPermissionsEntity)
        private readonly subAdminPermissionsRepository: Repository<SubAdminPermissionsEntity>
    ) { }

    async signUp(dto: SignUpDto) {
        try {
            const userExist = await this.usersRepository.findOne({ where: { email: dto.email } })
            if (userExist) {
                throw new HttpException(MESSAGE_CONSTANTS.emailAlreadyExist, HttpStatus.BAD_REQUEST)
            }

            const userCreated = await this.usersRepository.save(
                this.usersRepository.create({
                    email: dto.email,
                    password: (await this.authHelper.hashPassword(dto.password)),
                    phoneNumber: dto.phoneNumber,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    profilePic: dto.profilePic,
                    fullName: `${dto.firstName} ${dto.lastName}`
                })
            )

            const tokens = await this.tokenService.generateToken(userCreated);
            /**
             * When user's email is verified publish an event to create it's customer on stripe
            */
            this.eventBus.publish(new CreateCustomerOnStripeEvent(userCreated.id, userCreated.email, userCreated.stripeCustomerId));

            /**
             * When user's email is verified publish an event to create it's user on zoom
            */
            this.eventBus.publish(new CreateUserOnZoomEvent(userCreated.email, userCreated.firstName, userCreated.lastName));

            userCreated['tokens'] = tokens;
            // await this.authHelper.generateSecurityCodeAndSendMail(userCreated, SecurityCodeTypeEnum.verification)
            return { data: userCreated, message: MESSAGE_CONSTANTS.verificationEmailIsSentToYourEmail };

        } catch (error) {
            throw new HttpException(error.message || MESSAGE_CONSTANTS.somethingWentWrong, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addAdmin(dto: any) {
        try {
            const userExist = await this.usersRepository.findOne({ where: { email: dto.email } })
            if (userExist) {
                throw new HttpException(MESSAGE_CONSTANTS.emailAlreadyExist, HttpStatus.BAD_REQUEST)
            }

            const userCreated = await this.usersRepository.save(
                this.usersRepository.create({
                    email: dto.email,
                    password: (await this.authHelper.hashPassword(dto.password)),
                    phoneNumber: dto.phoneNumber,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    role: RoleEnum.admin
                })
            )

            return { message: 'Your account has been created' };

        } catch (error) {
            throw new HttpException(error.message || MESSAGE_CONSTANTS.somethingWentWrong, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async subAdmin(dto: AddSubAdminDto) {
        try {
            const userExist = await this.usersRepository.findOne({ where: { email: dto.email } })
            if (userExist) {
                throw new HttpException('This email is already registered as user or sub admin', HttpStatus.BAD_REQUEST)
            }

            const permissions = await this.subAdminPermissionsRepository.save(
                this.subAdminPermissionsRepository.create(dto.permissions)
            );
            
            const userCreated = await this.usersRepository.save(
                this.usersRepository.create({
                    email: dto.email,
                    password: (await this.authHelper.hashPassword(dto.password)),
                    firstName: dto.fullName,
                    role: RoleEnum.sub_admin,
                    about: dto.about,
                    subAdminPermissions: permissions.id,
                    profilePic: dto.profilePic,
                    resume: dto.resume
                })
            )            

            return { message: 'Sub Admin has been created', subAdmin: userCreated };

        } catch (error) {
            throw new HttpException(error.message || MESSAGE_CONSTANTS.somethingWentWrong, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async checkEmailExist(email: string) {
        const findEmail = await this.usersRepository.findOne({
            where: {
                email: email
            }
        })
        return findEmail ? true : false
    }

    public async login(
        loginDto: AuthEmailLoginDto,
    ): Promise<any> {

        const user = await this.usersRepository.findOne({
            where: {
                email: loginDto.email,
                // role: RoleEnum.user
            },
            relations: ['profilePic']
        })

        if (!user || !this.authHelper.matchPassword(loginDto.password, user.password)) {
            throw new HttpException(MESSAGE_CONSTANTS.incorrectEmailOrPassword, HttpStatus.NOT_FOUND)
        }

        if (user && user.role === RoleEnum.user && !user.isActive)
            throw new HttpException(MESSAGE_CONSTANTS.incorrectEmailOrPassword, HttpStatus.NOT_ACCEPTABLE)

        if (user && !user.zoomUserId) {
            this.eventBus.publish(new CreateUserOnZoomEvent(user.email, user.firstName, user.lastName));
        }

        if (user.zoomUserId == null) {
            /**
             * When user's zoom id does not exist publish an event to create it's user on zoom
             */
            this.eventBus.publish(new CreateUserOnZoomEvent(user.email, user.firstName, user.lastName));
        }

        const tokens = await this.tokenService.generateToken(user);
        user.lastSeen = new Date;
        await user.save();
        return { user, tokens };
    }

    async verifyEmail(code: string) {
        const securityCode = await this.securityCodeService.findASecurityCode(code, SecurityCodeTypeEnum.verification)

        if (!securityCode) {
            throw new HttpException(MESSAGE_CONSTANTS.invalidCode, HttpStatus.BAD_REQUEST)
        }

        const user = await this.usersRepository.findOne({
            where: {
                id: securityCode.requesterId
            }
        })

        if (user.isEmailVerified) {
            return MESSAGE_CONSTANTS.alreadyVerified
        }

        await this.usersRepository.update({
            id: user.id
        }, {
            isEmailVerified: true
        })

        /**
         * When user's email is verified publish an event to create it's customer on stripe
         * ! ALERT
         * ! commenting it currently as it is not essential in our flow.
        */
        // this.eventBus.publish(new CreateCustomerOnStripeEvent(user.email));
    }

    async sendResetPasswordLink({ email }: AuthForgotPasswordDto) {
        const user = await this.usersRepository.findOne({ where: { email } })

        if (!user) {
            throw new HttpException(MESSAGE_CONSTANTS.userNotFound, HttpStatus.NOT_FOUND)
        }

        this.authHelper.generateSecurityCodeAndSendMail(user, SecurityCodeTypeEnum.forgot)

        return { message: MESSAGE_CONSTANTS.resetPassLinkSentToYourEmail }
    }

    async verifyResetPasswordCode(code: string) {
        const securityCode = await this.securityCodeService.findASecurityCode(code, SecurityCodeTypeEnum.forgot)

        if (!securityCode) {
            throw new HttpException('This security code is expired', HttpStatus.BAD_REQUEST)
        }

        return true
    }

    async resetPassword(body: AuthResetPasswordDto) {
        try {
            const securityCode = await this.securityCodeService.findASecurityCode(body.code, SecurityCodeTypeEnum.forgot)

            if (!securityCode) {
                throw new HttpException(MESSAGE_CONSTANTS.invalidCode, HttpStatus.BAD_REQUEST)
            }

            const passwordReseted = await this.usersRepository.update({
                id: securityCode.requesterId
            }, {
                password: await this.authHelper.hashPassword(body.password)
            })

            if (passwordReseted) {
                await this.securityCodeService.deleteSecurityCodes(securityCode.requesterId, SecurityCodeTypeEnum.forgot)
            }

            return { message: MESSAGE_CONSTANTS.passwordUpdatedSuccessfully }
        } catch (error) {
            throw new HttpException(error.message || MESSAGE_CONSTANTS.somethingWentWrong, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refreshTokens(rid: string) {

        try {
            const userWithRidExists = await this.usersRepository.findOne({
                where: { refreshTokenId: rid }
            })

            if (!userWithRidExists) {
                throw new HttpException(MESSAGE_CONSTANTS.invalidToken, HttpStatus.NOT_ACCEPTABLE)
            }

            const newRid = randomUUID()
            await this.usersRepository.update({ id: userWithRidExists.id }, { refreshTokenId: newRid })

            const tokens = await this.tokenService.generateToken(userWithRidExists);

            return { user: userWithRidExists, tokens }
        } catch (error) {
            throw new HttpException(error.message || MESSAGE_CONSTANTS.somethingWentWrong, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async myProfile(id: string) {
        return await this.usersRepository.findOne({
            where: { id: id },
            relations: ['availability_days', 'availability_days.day',
                'availability_slots', 'availability_slots.timeSlot', 'otherDocuments',
                "profilePic", "pitchDeck", "businessPlan"]
        })
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
