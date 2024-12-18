import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";
import { FileEntity } from "../files/file.entity";

@Entity('op_blog')
export class BlogEntity extends AbstractBaseEntity {

    @Column({ name: "title" })
    title: string;

    @Column({ name: "description" })
    description: string;

    @Column({ name: "view_count" , default : 0})
    viewCount: number;

    @Column({ nullable: true, name: "thumbnail" })
    @OneToOne(() => FileEntity)
    @JoinColumn({ name: "thumbnail" })
    thumbnail?: string;

    @OneToMany(() => FileEntity, (file) => file.blogId)
    attachments?: FileEntity[];
}