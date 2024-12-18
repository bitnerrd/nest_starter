import { Entity, Column, OneToMany } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { MessagesEntity } from "../messages/messages.entity";
import { ParticipantsEntity } from "../participants/participants.entity";

@Entity("room")
export class RoomEntity extends AbstractBaseEntity {

    @OneToMany(() => ParticipantsEntity, (p) => p.roomId)
    participants?: ParticipantsEntity[];

    @OneToMany(() => MessagesEntity, (p) => p.roomId)
    messages?: MessagesEntity[];
    
}