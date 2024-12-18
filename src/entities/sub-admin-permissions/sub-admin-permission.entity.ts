import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../baseEntity/abstract-base.entity';

@Entity('sub_admin_permissions')
export class SubAdminPermissionsEntity extends AbstractBaseEntity {
  @Column({ name: 'user_control', default: false })
  userControl: boolean;

  @Column({ name: 'advisors_requests', default: false })
  advisorsRequest: boolean;

  @Column({ name: 'startup_requests', default: false })
  startupRequests: boolean;

  @Column({ name: 'access_to_mailing_list', default: false })
  accessToMailingList: boolean;

  @Column({ name: 'newsletter', default: false })
  newsletter: boolean;

  @Column({ name: 'other_email_campaigns', default: false })
  otherEmailCampaigns: boolean;
}
