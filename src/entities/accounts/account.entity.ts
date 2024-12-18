import { Exclude } from 'class-transformer';
import { RoleEnum } from 'src/utils/enums/enums';
import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../baseEntity/abstract-base.entity';

@Entity('accounts')
export class AccountEntity extends AbstractBaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Exclude({ toPlainOnly: true })
  @Column({})
  password: string;

  @Column({ enum: RoleEnum, default: RoleEnum.user })
  role: string;

  @Column({ nullable: true })
  birthday: string;
}
