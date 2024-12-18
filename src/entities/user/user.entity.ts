import { Exclude } from 'class-transformer';
import { ProfessionEnum, RoleEnum } from 'src/utils/enums/enums';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractBaseEntity } from '../baseEntity/abstract-base.entity';
import { UserAvailabilityDays } from '../userAvailabilityDays/user-availability-days.entity';
import { UserAvailabilityTimeSlots } from '../userAvailabilityTimeSlots/user-availability-time-slots.entity';
import { FileEntity } from '../files/file.entity';
import { SubscribedPlansEntity } from '../subscribed-plans/subscribed-plans.entity';
import { SubAdminPermissionsEntity } from '../sub-admin-permissions/sub-admin-permission.entity';
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

  @Column({ name: 'country', nullable: true })
  country: string;

  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'linkedin_profile', nullable: true })
  linkedinProfile: string;

  @Column({ name: 'skills', nullable: true })
  skills: string;

  @Column({
    name: 'are_you',
    nullable: true,
    type: 'enum',
    enum: ProfessionEnum,
  })
  designation: string;

  @Column({ name: 'payment_verified', nullable: true, default: false })
  paymentVerified?: boolean;

  @Column({ name: 'stripe_customer_id', nullable: true })
  stripeCustomerId?: string;

  @Column({ name: 'subscription_id', nullable: true })
  subscriptionId?: string;

  @Column({
    type: 'enum',
    enum: ProfessionEnum,
    name: 'looking_for',
    nullable: true,
    array: true,
  })
  lookingFor: ProfessionEnum[];

  @Column({ name: 'about', nullable: true })
  about?: string;

  @Column({ name: 'last_seen', type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ name: 'profile_pic', nullable: true })
  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'profile_pic' })
  profilePic: string;

  @Column({ name: 'pitch_deck', nullable: true })
  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'pitch_deck' })
  pitchDeck: string;

  @Column({ type: 'boolean', name: 'pitch_deck_approved', default: false })
  pitchDeckApproved: boolean;

  @Column({ name: 'business_plan', nullable: true })
  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'business_plan' })
  businessPlan: string;

  @Column({ name: 'resume', nullable: true })
  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'resume' })
  resume: string;

  @Column({ name: 'stripe_setup_intent_id', nullable: true })
  stripeSetupIntentId?: string;

  @Column({ name: 'stripe_payment_method_id', nullable: true })
  stripePaymentMethodId?: string;

  @Column({ name: 'zoom_user_id', nullable: true })
  zoomUserId?: string;

  @OneToOne(
    () => SubscribedPlansEntity,
    (subscribed_plan) => subscribed_plan.user,
  )
  subscribedPlan: SubscribedPlansEntity;

  @OneToMany(
    () => UserAvailabilityDays,
    (availability_day) => availability_day.user,
  )
  availability_days: UserAvailabilityDays[];

  @OneToMany(
    () => UserAvailabilityTimeSlots,
    (availability_slot) => availability_slot.user,
  )
  availability_slots: UserAvailabilityTimeSlots[];

  @OneToMany(() => FileEntity, (file) => file.parentId)
  otherDocuments: FileEntity[];

  @Column({ name: 'sub_admin_permissions', nullable: true })
  @OneToOne(() => SubAdminPermissionsEntity)
  @JoinColumn({ name: 'sub_admin_permissions' })
  subAdminPermissions: string;
}
