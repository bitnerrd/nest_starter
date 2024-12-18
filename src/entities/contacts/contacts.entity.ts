import { ContactRequestStatusEnum } from "src/utils/enums/enums";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'op_contacts' })
export class ContactsEntity extends AbstractBaseEntity {

    @Column({ name: 'to_or_receiver_id' })
    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'to_or_receiver_id' })
    toOrReceiver?: string;

    @Column({ name: 'from_or_sender_id' })
    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'from_or_sender_id' })
    fromOrSender?: string;

    @Column({ nullable: true, name: 'status', type: 'enum', enum: ContactRequestStatusEnum })
    status: ContactRequestStatusEnum;

    @Column({ nullable: true, name: "room_id" })
    roomId?: string;
}