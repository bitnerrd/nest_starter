import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { SubscriptionsEntity } from "../subscriptions/subscriptions.entity";

@Entity('op_subscribed_plan')
export class SubscribedPlansEntity extends AbstractBaseEntity {

    @Column({ name: 'user_id', nullable: true })
    @OneToOne(() => UserEntity, (user) => user.subscribedPlan, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user?: string;

    @Column({ name: 'subscription_id', nullable: true })
    @ManyToOne(() => SubscriptionsEntity, (subscription) => subscription.subscribedPlans, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'subscription_id' })
    subcription?: string;
}