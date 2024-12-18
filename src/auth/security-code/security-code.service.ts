import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecurityCodesEntity } from 'src/entities/security-codes/security-codes.entity';
import { SECURITY_CODE_VALIDITY_TIME } from 'src/utils/constants/constants-values';
import { SecurityCodeTypeEnum } from 'src/utils/enums/enums';
import { Between, Repository } from 'typeorm';

@Injectable()
export class SecurityCodeService {
    constructor(
        @InjectRepository(SecurityCodesEntity)
        private readonly securityCodeRepository: Repository<SecurityCodesEntity>,
    ) { }

    // ? This will return a security that is generated within 10 minutes or whatever the validity time is.
    async findASecurityCode(code: string, type: SecurityCodeTypeEnum): Promise<SecurityCodesEntity> {
        return await this.securityCodeRepository.findOne({
            where: {
                code: code,
                type,
                createdAt: Between(new Date(Date.now() - SECURITY_CODE_VALIDITY_TIME), new Date(Date.now()))
            }
        })
    }

    async deleteSecurityCodes(requesterId: string, type: SecurityCodeTypeEnum) {

        return await this.securityCodeRepository.delete({
            requesterId,
            type,
        })
    }

    async createSecurityCode(requesterId: string, code: string, type: SecurityCodeTypeEnum) {
        return await this.securityCodeRepository.save(
            this.securityCodeRepository.create({
                requesterId,
                code: code,
                type
            })
        )
    }
}
