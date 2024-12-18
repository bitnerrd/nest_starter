import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './files/file.entity';
import { SecurityCodesEntity } from './security-codes/security-codes.entity';
import { UserEntity } from './user/user.entity';
import { BlogEntity } from './blogs/blogs.entity';
import { DaysEntity } from './daysOfWeek/days-of-week.entity';
import { TimeSlots } from './timeSlots/time-slots.entity';
import { UserAvailabilityDays } from './userAvailabilityDays/user-availability-days.entity';
import { SubscriptionsEntity } from './subscriptions/subscriptions.entity';
import { UserAvailabilityTimeSlots } from './userAvailabilityTimeSlots/user-availability-time-slots.entity';
import { SubscribedPlansEntity } from './subscribed-plans/subscribed-plans.entity';
import { WebhooksEntity } from './webhooks/webhooks.entity';
import { ContactsEntity } from './contacts/contacts.entity';
import { Meetings } from './meetings/meetings.entity';
import { VisitorEntity } from './visitors/visitors.entity';
import { MessagesEntity } from './messages/messages.entity';
import { ParticipantsEntity } from './participants/participants.entity';
import { RoomEntity } from './room/room.entity';
import { SubAdminPermissionsEntity } from './sub-admin-permissions/sub-admin-permission.entity';

/**
 * ? Note: define all of your entities in this array
 */
const entitiesArr = [
  TypeOrmModule.forFeature([
    UserEntity,
    FileEntity,
    SecurityCodesEntity,
    BlogEntity,
    DaysEntity,
    TimeSlots,
    UserAvailabilityDays,
    SubscriptionsEntity,
    UserAvailabilityTimeSlots,
    SubscribedPlansEntity,
    WebhooksEntity,
    ContactsEntity,
    Meetings,
    VisitorEntity,
    MessagesEntity,
    ParticipantsEntity,
    RoomEntity,
    SubAdminPermissionsEntity,
  ]),
];

@Global()
@Module({
  imports: [...entitiesArr],
  exports: [...entitiesArr],
})
export class EntitiesModule {}
