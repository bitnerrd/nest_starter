import { PricingPlanEnum, TenureEnum } from 'src/utils/enums/enums';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../baseEntity/abstract-base.entity';
import { SubscribedPlansEntity } from '../subscribed-plans/subscribed-plans.entity';

@Entity('op_subscriptions')
export class SubscriptionsEntity extends AbstractBaseEntity {
  @Column({ nullable: true })
  planType: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'stripe_subscription_price_id', nullable: true })
  stripeSubscriptionPriceId?: string;

  @Column({ nullable: true, name: 'tenure', type: 'enum', enum: TenureEnum })
  tenure: TenureEnum;

  @OneToMany(
    () => SubscribedPlansEntity,
    (subscribedPlan) => subscribedPlan.subcription,
  )
  subscribedPlans: SubscribedPlansEntity[];
}
