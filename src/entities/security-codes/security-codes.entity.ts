import { SecurityCodeTypeEnum } from "src/utils/enums/enums";
import { Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";

@Entity('op_security_codes')
export class SecurityCodesEntity extends AbstractBaseEntity {

  // ? ReuesterId = user id
  @Column()
  requesterId: string;

  @Column()
  code: string;

  @Column({ enum: SecurityCodeTypeEnum, nullable: true })
  type: SecurityCodeTypeEnum;
}
