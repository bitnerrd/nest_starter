import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { UserAvailabilityDays } from "../userAvailabilityDays/user-availability-days.entity";


@Entity({ name: 'op_days' })
export class DaysEntity extends AbstractBaseEntity {

    @ApiProperty({ example: 'Monday' })
    @Column()
    name?: string;

    @Column()
    sorting_id: Number;

    @OneToMany(() => UserAvailabilityDays, (availability_day) => availability_day.day)
    availability_days: UserAvailabilityDays[]
}