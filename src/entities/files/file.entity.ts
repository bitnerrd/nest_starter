import appConfig from 'src/config/app.config';
import { AfterInsert, AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../baseEntity/abstract-base.entity';
import { BlogEntity } from '../blogs/blogs.entity';
import { MessagesEntity } from '../messages/messages.entity';
import { UserEntity } from '../user/user.entity';
import { Exclude } from 'class-transformer';


@Entity({ name: 'op_files' })
export class FileEntity extends AbstractBaseEntity {

  @Column()
  path: string;

  @Column()
  size: number;

  @Column({ nullable: true, name: 'description' })
  description: string;

  @Column({ nullable: true, name: 'name' })
  name: string;

  @Column({ nullable: true, name: 'role' })
  role: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ nullable: true, name: 'file_name' })
  fileName: string;

  @Column({ name: 'meta_data', type: 'simple-json', nullable: true })
  metaData: any;

  @Column({ nullable: true })
  encoding: string;

  @Column({ nullable: true, name: "parent_id" })
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "parent_id" })
  parentId: string;

  @Column({ nullable: true, name: "blog_id" })
  @ManyToOne(() => BlogEntity)
  @JoinColumn({ name: "blog_id" })
  blogId: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = appConfig().backendDomain + this.path;
    }
  }
}
