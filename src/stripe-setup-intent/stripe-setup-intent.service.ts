import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';


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
export class StripeSetupIntentService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async paymentIntentSuccess(user: UserEntity) {
        try {
            const userFromDB = await this.userRepository.findOne({
                where: {
                    id: user.id
                }
            })
            const paymentMethod = await this.getPaymentMethodListFromStripe(userFromDB.stripeCustomerId)
            if (paymentMethod) {
                return { message: 'Payment Method added successfully' }
            }

        } catch (error) {
            throw new HttpException('No payment method found', HttpStatus.NOT_FOUND)
        }
    }

    async getPaymentMethodListFromStripe(stripeCustomerId: string) {
        const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId)
        if (stripeCustomer.deleted !== true && stripeCustomer.default_source) {
            return await stripe.paymentMethods.retrieve(
                stripeCustomer.invoice_settings.default_payment_method.toString()
            );
        }

        const paymentMethods = await stripe.customers.listPaymentMethods(
            stripeCustomerId,
            { type: 'card' }
        );
        if (!paymentMethods.data.length) {
            throw new HttpException('No payment method found', HttpStatus.BAD_REQUEST)
        }
        else {
            return paymentMethods.data[0]
        }
    }

    async createSetupIntent(user: UserEntity, session: Record<string, any>, force?: boolean) {

        const userFromDB = await this.userRepository.findOne({ where: { id: user.id } })
        const userPaymentMethod = await this.getPaymentMethodListFromStripe(userFromDB.stripeCustomerId)

        if (userPaymentMethod) {
            throw new HttpException('Payment method already added', HttpStatus.BAD_REQUEST)
        }

        if (force) {
            return await this.createSetupIntentOnStripeAndStoreInSession(user, session)
        }

        if (!session.setup_intent && user.stripeSetupIntentId) {
            this.setupSession(session, { id: user.stripeSetupIntentId })
            session = session.setup_intent ? session : { sessionsetup_intent: user.stripeSetupIntentId }
        }

        if (!session.setup_intent) {
            return await this.createSetupIntentOnStripeAndStoreInSession(user, session)
        }
        else {
            const setupIntent = await this.getStripeSetupIntent(session)

            if (!setupIntent) {
                return await this.createSetupIntentOnStripeAndStoreInSession(user, session)

            } else {
                if (setupIntent.status === 'canceled' || setupIntent.status !== 'succeeded') {
                    return await this.createSetupIntentOnStripeAndStoreInSession(user, session)
                }
                return setupIntent.client_secret
            }
        }
    }

    async createSetupIntentOnStripeAndStoreInSession(user: UserEntity, session: Record<string, any>) {
        const setupIntent = await this.createStripeSetupIntent(user)

        this.setupSession(session, setupIntent)
        await this.insertSetupIntentIdInUser(user, setupIntent.id)
        return setupIntent.client_secret
    }

    async insertSetupIntentIdInUser(user: UserEntity, stripeSetupIntentId: string) {
        return await this.userRepository.update(user.id, { stripeSetupIntentId })
    }

    setupSession(session: Record<string, any>, setupIntent: any) {
        session.setup_intent = setupIntent.id
    }

    async createStripeSetupIntent(user: UserEntity) {
        const userFromDB = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['subscribedPlan']
        })
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            customer: user.stripeCustomerId,
            metadata: {
                user_id: user.id,
                user_email: user.email,
                subscribed_plan: userFromDB.subscribedPlan.id
            }
        });
        return setupIntent
    }

    async getStripeSetupIntent(session: any) {
        const setupIntent = await stripe.setupIntents.retrieve(
            session.setup_intent
        );

        if (!setupIntent) {
            return false
        }
        return setupIntent
    }

    async checkoutSession(dto) {

        const user = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        });
        if (user) {
            user.subscriptionId = dto.subscriptionId;
            await user.save();
        }
        // comment here
        return await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: dto.productId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_DOMAIN}/dashboard`,
            cancel_url: `${process.env.FRONTEND_DOMAIN}/subscription-payment`,
            customer_email: dto.email,
            automatic_tax: { enabled: false },
        });

    }

}
