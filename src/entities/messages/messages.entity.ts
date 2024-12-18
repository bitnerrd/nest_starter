import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { FileEntity } from "../files/file.entity";
import { RoomEntity } from "../room/room.entity";

@Entity("messages")
export class MessagesEntity extends AbstractBaseEntity {

    @Column({ name: "user_id" })
    userId: string;

    @Column({ nullable: false, name: "room_id" })
    @ManyToOne(() => RoomEntity)
    @JoinColumn({ name: "room_id" })
    roomId: string;

    @Column({ name: 'message' })
    message: string;

    @Column({ name: 'is_seen', default: false })
    isSeen: boolean;

    @Column({ nullable: true, name: "attachment" })
    @OneToOne(() => FileEntity)
    @JoinColumn({ name: "attachment" })
    attachment?: string;

    @Column({ nullable: true, name: "deleted_by" })
    deletedBy?: string;
}