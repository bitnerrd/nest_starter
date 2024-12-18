import { Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";

@Entity('op_visitor')
export class VisitorEntity extends AbstractBaseEntity {

    @Column({ name: "user_ip " })
    userIp: string;

    @Column({ name: "count", default: 0 })
    count: number;
}