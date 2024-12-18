import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { DaysEntity } from "../daysOfWeek/days-of-week.entity";
import { TimeSlots } from "../timeSlots/time-slots.entity";
import { UserEntity } from "../user/user.entity";

@Entity("meetings")
export class Meetings extends AbstractBaseEntity {

    @Column({ name: 'organizer_id' })
    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'organizer_id' })
    organizer?: string;

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'op_meeting_participants',
        joinColumn: {
            name: 'meeting_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    participants: UserEntity[]

    @Column({ name: 'day_id' })
    @ManyToOne(() => DaysEntity)
    @JoinColumn({ name: 'day_id' })
    day?: string;

    @Column({ name: 'time_slot_id' })
    @ManyToOne(() => TimeSlots)
    @JoinColumn({ name: 'time_slot_id' })
    timeSlot?: string;

    @Column({ name: 'meeting_date', nullable: true })
    meetingDate: Date;

    @Column({ name: 'expected_start_time', nullable: true })
    expectedStartTime: string

    @Column({ name: 'actual_start_time', nullable: true })
    actualStartTime: string

    @Column({ name: 'expected_end_time', nullable: true })
    expectedEndTime: string

    @Column({ name: 'actual_end_time', nullable: true })
    actualEndTime: string

    @Column({ name: 'cancelled', default: false })
    cancelled: boolean

    @Column({ name: "cancelled_at", nullable: true })
    cancelledAt: Date

    @Column({ name: 'cancelled_by_id', nullable: true })
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'cancelled_by_id' })
    cancelledBy?: string;

    @Column({ name: 'cancelation_reason', type: 'text', nullable: true })
    cancelationReason: string

    @Column({ name: 'zoom_meeting_id', nullable: true })
    zoomMeetingId: string;

    @Column({ name: 'zoom_meeting_url', nullable: true })
    zoomMeetingUrl: string;

    @Column({ name: 'zoom_meeting_host', nullable: true })
    zoomMeetingHost: string

    @Column({ name: 'meeting_agenda', nullable: true })
    meetingAgenda: string

    @Column({ name: 'participant_join_meeting_url', nullable: true })
    participantJoinMeetingUrl: string

    @Column({ name: 'organizer_start_meeting_url', nullable: true })
    organizerStartMeetingUrl: string

    @Column({ name: 'note', nullable: true })
    note: string;
}