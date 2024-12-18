import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { UserEntity } from 'src/entities/user/user.entity';
import { WebhooksEntity } from 'src/entities/webhooks/webhooks.entity';
import { WebhookPlatformEnum, WebhookPurposeEnum } from 'src/utils/enums/enums';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
dotenv.config()

/**
 * Initialize Stripe
*/
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    /**
     * ! ALERT
     * ? NOTE
     * ? There is error of date type string while requiring it from the env.
     * ? So I am validating that version is present in env and manually making
     * ? sure that they are equal.
    */
    apiVersion: '2022-11-15',
});

@Injectable()
export class WebhooksService implements OnModuleInit {
    constructor(
        private configService: ConfigService,
        @InjectRepository(WebhooksEntity)
        private readonly webhookRepository: Repository<WebhooksEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    onModuleInit() {
        console.log('Webhook Service has been initiated.');
        this.registerWebhookOnStripe()
    }


    async registerWebhookOnStripe() {
        const webHookExists = await this.getStripeSetupIntentWebhookFromDB()
        if (webHookExists) {
            const webhookEndpointExistOnStripe = await stripe.webhookEndpoints.retrieve(
                webHookExists.webhookId
            );
            if (webhookEndpointExistOnStripe) return
            const webHookCreatedOnStripe = await this.createWebhookOnStripe()
            return await this.webhookRepository.update(webHookExists.id, { webhookId: webHookCreatedOnStripe.id })
        }

        if (!(await this.checkIfWebhookExistsOnStripeThanInsertInDb())) {
            const webHookCreatedOnStripe = await this.createWebhookOnStripe()
            return await this.insertStripeSetupIntentWebhookInDb(webHookCreatedOnStripe.id)
        }
    }

    async createWebhookOnStripe() {
        return await stripe.webhookEndpoints.create({
            url: `${this.configService.get('app.backendDomain')}/api/v1/webhooks/setup-intent-status`,
            enabled_events: [
                'setup_intent.succeeded',
                'setup_intent.canceled',
                'setup_intent.requires_action',
                'setup_intent.setup_failed'
            ],
            metadata: {
                webhookPurpose: WebhookPurposeEnum.setupIntent
            }
        });
    }

    async checkIfWebhookExistsOnStripeThanInsertInDb() {
        let inserted = false

        const registeredWebhooks = await this.getAllTheRegisteredWebhooksFromStripe([])

        console.log('registeredWebhooks', registeredWebhooks)
        for (const webHook of registeredWebhooks) {
            if (webHook.metadata['webhookPurpose'] === WebhookPurposeEnum.setupIntent) {
                await this.insertStripeSetupIntentWebhookInDb(webHook.id)
                inserted = true
            }
        }

        return inserted
    }

    async insertStripeSetupIntentWebhookInDb(webHookId: string) {
        let payload = {
            webhookId: webHookId,
            webhookPlatform: WebhookPlatformEnum.stripe,
            webhookPurpose: WebhookPurposeEnum.setupIntent
        }

        return await this.insertWebhookInDb(payload)
    }

    async getStripeSetupIntentWebhookFromDB() {
        return await this.webhookRepository.findOne({
            where: {
                webhookPlatform: WebhookPlatformEnum.stripe,
                webhookPurpose: WebhookPurposeEnum.setupIntent
            }
        })
    }

    async insertWebhookInDb(payload: any) {
        return await this.webhookRepository.save(
            this.webhookRepository.create(payload)
        )
    }

    async checkStripeSetupIntentStatus(stripePayload: any) {

        const setupIntent = stripePayload.data.object

        if (stripePayload.data?.object?.object == 'checkout.session') {
            if (stripePayload.data?.object?.status == 'complete') {            
                const user = await this.userRepository.findOne({
                    where: {
                        email: stripePayload?.data?.object?.customer_details?.email,
                    }
                });
              
                if (user) {
                    user.stripeCustomerId = stripePayload?.data?.object?.customer_email;
                    user.paymentVerified = true;
                    const u =await user.save();                   
                }
            }
        }

        switch (stripePayload.type) {
            case 'setup_intent.succeeded':
                await this.getPaymentMethodsFromStripeAndUpdateUserInDB(setupIntent.metadata.user_id.toString())
                break;

            case 'setup_intent.canceled':
                await this.updateUserSetupIntentIdToNull(setupIntent.metadata.user_id.toString())
                break;

            case 'setup_intent.requires_action':
                await this.updateUserSetupIntentIdToNull(setupIntent.metadata.user_id.toString())
                break;

            case 'setup_intent.setup_failed':
                await this.updateUserSetupIntentIdToNull(setupIntent.metadata.user_id.toString())
                break;

            default:
                break;
        }
        return true
    }

    async getPaymentMethodsFromStripeAndUpdateUserInDB(userId: string) {
        const paymentMethods = await this.getThePaymentMethodFromStripe(userId)
        if (paymentMethods) {
            return await this.userRepository.update(userId, { stripePaymentMethodId: paymentMethods.id })
        }
    }

    async getThePaymentMethodFromStripe(userId: string) {
        const user = await this.userRepository.findOne(userId)
        const paymentMethods = await stripe.customers.listPaymentMethods(
            user.stripeCustomerId,
            { type: 'card' }
        );
        if (paymentMethods.data.length) return paymentMethods.data[0]
        return false
    }

    async getAllTheRegisteredWebhooksFromStripe(webhooks?: any[]) {
        const webHook = await this.getListOfRegisteredWebhooksOnStripe()
        if (webHook.has_more) {
            webhooks.push(...webHook.data)
            await this.getAllTheRegisteredWebhooksFromStripe(webhooks)
        }
        else {
            return webhooks
        }
    }

    async getListOfRegisteredWebhooksOnStripe() {
        return await stripe.webhookEndpoints.list({
            limit: 100
        });
    }

    async updateUserSetupIntentIdToNull(id: string) {
        await this.userRepository.update({ id }, { stripeSetupIntentId: null })
    }
}
