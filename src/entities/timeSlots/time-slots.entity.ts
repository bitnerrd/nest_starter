import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity,OneToMany } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { UserAvailabilityTimeSlots } from "../userAvailabilityTimeSlots/user-availability-time-slots.entity";


@Entity({ name: 'op_time_slots' })
export class TimeSlots extends AbstractBaseEntity {

    
    @Column()
    start_time: Number;

    @Column()
    end_time: Number;

    @OneToMany(() => UserAvailabilityTimeSlots, (availability_slot) => availability_slot.timeSlot)
    availability_slots: UserAvailabilityTimeSlots[]
}