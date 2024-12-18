import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { UserEntity } from "src/entities/user/user.entity";
import { MailService } from "src/mail/mail.service";
import { SecurityCodeTypeEnum } from "src/utils/enums/enums";
import { SecurityCodeService } from "../security-code/security-code.service";

@Injectable()
export class AuthHelper {
    constructor(
        private readonly securityCodeService: SecurityCodeService,
        private readonly mailService: MailService
    ) { }

    async hashPassword(pass: string, rounds = 8) {
        return bcrypt.hashSync(pass, rounds);
    }

    matchPassword(pass: string, hash: string, _round = 10) {
        return bcrypt.compareSync(pass, hash);
    }

    async generateSecurityCodeAndSendMail(user: UserEntity, type: SecurityCodeTypeEnum) {
        
        // delete the all the previous codes of the user with this type
        await this.securityCodeService.deleteSecurityCodes(user.id, type)
        // generate a new random UUID
        const code = randomUUID()
        // create a new security code with that UUID
        await this.securityCodeService.createSecurityCode(user.id, code, type)

        // send user an email containing the code.
        return await this.mailService.sendEmail(user, type, code)
    }
}