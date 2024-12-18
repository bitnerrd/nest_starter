import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { FileEntity } from "../files/file.entity";
import { RoomEntity } from "../room/room.entity";
import { UserEntity } from "../user/user.entity";

@Entity("participants")
export class ParticipantsEntity extends AbstractBaseEntity {

    @Column({ nullable: false, name: "user_id" })
    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    userId: string;

    @Column({ nullable: false, name: "room_id" })
    @ManyToOne(() => RoomEntity)
    @JoinColumn({ name: "room_id" })
    roomId: string;
}