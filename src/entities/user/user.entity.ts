import { Exclude } from 'class-transformer';
import { RoleEnum } from 'src/utils/enums/enums';
import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../baseEntity/abstract-base.entity';

// import { SubAdminPermissionsEntity } from "../sub-admin-permissions/sub-admin-permission";

@Entity('op_users')
export class UserEntity extends AbstractBaseEntity {
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password' })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'refresh_token_id', nullable: true })
  refreshTokenId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ enum: RoleEnum, default: RoleEnum.user })
  role: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;
}
