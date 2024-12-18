import { WebhookPlatformEnum, WebhookPurposeEnum } from "src/utils/enums/enums";
import { Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "../baseEntity/abstract-base.entity";

@Entity({ name: 'op_webhooks' })
export class WebhooksEntity extends AbstractBaseEntity {

    @Column({ name: 'webhook_id', nullable: true })
    webhookId?: string;

    @Column({ name: "webhook_platform", nullable: true, type: 'enum', enum: WebhookPlatformEnum })
    webhookPlatform?: string;

    @Column({ name: "webhook_purpose", unique: true, nullable: true, type: 'enum', enum: WebhookPurposeEnum })
    webhookPurpose?: string;
}