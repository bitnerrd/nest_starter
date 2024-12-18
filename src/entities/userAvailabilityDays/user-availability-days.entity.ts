import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { DaysEntity } from '../daysOfWeek/days-of-week.entity';
import { UserEntity } from '../user/user.entity';


@Entity({ name: 'op_user_availability_days' })
export class UserAvailabilityDays extends AbstractBaseEntity {

    @ManyToOne(() => UserEntity, {
        onDelete: "CASCADE",
    })
    user: UserEntity


    @ManyToOne(() => DaysEntity, (day) => day.availability_days)
    day: DaysEntity

}