import { Entity, ManyToOne, } from 'typeorm';
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { TimeSlots } from '../timeSlots/time-slots.entity';
import { UserEntity } from '../user/user.entity';


@Entity({ name: 'op_user_availability_time_slots' })
export class UserAvailabilityTimeSlots extends AbstractBaseEntity {

    @ManyToOne(() => UserEntity, {
        onDelete: "CASCADE",
    })
    user: UserEntity


    @ManyToOne(() => TimeSlots, (timeSlots) => timeSlots.availability_slots)
    timeSlot: TimeSlots

}