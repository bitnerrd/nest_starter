import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsEntity } from 'src/entities/subscriptions/subscriptions.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { TenureEnum } from 'src/utils/enums/enums';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
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
export class StripeSubscriptionsService implements OnModuleInit {
    constructor(
        @InjectRepository(SubscriptionsEntity)
        private readonly subscriptionRepository: Repository<SubscriptionsEntity>
    ) { }
    onModuleInit() {
        console.log('Module has been initialized.')
        this.stripeSubscriptions()
    }

    async stripeSubscriptions() {
        const subscriptions = await this.subscriptionRepository.find();
        for (const subscription of subscriptions) {
            if (!subscription.stripeSubscriptionPriceId) {
                /**
                 * price column is null it should have the stripe price id to create subscription against users
                 * so, let's check if the price exists on stripe or not
                */
                const price = await this.searchThisSubscriptionPriceExistsOnStripe(subscription)
                if (price) {
                    // price exists on stripe so we only need to update the subscription
                    await this.updateSubscription(subscription, price)
                }
                else {
                    /**
                     * price does not exists on stripe as well
                     * so, let's create one and update subscription
                    */
                    await this.createPriceOnStripeAndUpdateSubscription(subscription)
                }
            }
            else {
                /**
                 * price column has a value So, let's chek does this exist on stripe or not
                */
                const price = await this.getPriceFromStripe(subscription)

                /**
                 * if the price column's id does not exist on stripe
                */
                if (!price) {
                    console.log('No price exists on stripe with this price id \n So, searching with other params...')
                    const searchedPrice = await this.searchThisSubscriptionPriceExistsOnStripe(subscription)
                    if (searchedPrice) {
                        console.log('Price found on stripe \n So, updating subscription...')
                        await this.updateSubscription(subscription, searchedPrice)
                    }
                    else {
                        console.log('No price exists on stripe of this subscription \n So, creating a new one...')
                        await this.createPriceOnStripeAndUpdateSubscription(subscription)
                    }
                }

                /**
                 * if subscription price is different than stripe then create a new price
                 * on stripe and assign that to this subscription
                 * ? Note unit_price of a price cannot be updated (according to my findings/understanding),
                 * ? So, create another price and assign it to this one. 
                */
                if (price && price.unit_amount !== (subscription.amount * 100)) {
                    console.log('stripe price is not equal of the subscription price \n So, updating price...')
                    await this.updatePriceOnStripe(price.id)
                    await this.archiveProductOnStripe(price.product.toString(), subscription)
                    await this.createPriceOnStripeAndUpdateSubscription(subscription)
                }
            }
        }
    }

    async archiveProductOnStripe(stripeProductId: string, subscription: SubscriptionsEntity) {
        return await stripe.products.update(
            stripeProductId, {
            active: false,
            name: `Archived ${subscription.planType}`
        }
        );
    }

    async updatePriceOnStripe(stripePriceId: string) {
        return await stripe.prices.update(
            stripePriceId,
            {
                active: false
            }
        );
    }

    async createPriceOnStripeAndUpdateSubscription(subscription: SubscriptionsEntity) {
        const stripePrice = await this.createPriceOnStripe(subscription)
        return await this.updateSubscription(subscription, stripePrice)
    }

    async updateSubscription(subscription: SubscriptionsEntity, stripePrice: any) {
        return await this.subscriptionRepository.update({ id: subscription.id }, { stripeSubscriptionPriceId: stripePrice.id })
    }

    async searchThisSubscriptionPriceExistsOnStripe(subscription: SubscriptionsEntity) {
        const searchedPrice = await stripe.prices.search({
            query: `
                active:"true" AND
                metadata["name"]:"${subscription.planType}" AND
                metadata["price"]:"${(subscription.amount * 100)}"
            `,
        });
        if (searchedPrice.data.length > 0) {
            return searchedPrice.data[0]
        }
        else {
            return false
        }
    }

    async getPriceFromStripe(subscription: SubscriptionsEntity) {
        try {
            const price = await stripe.prices.retrieve(
                subscription.stripeSubscriptionPriceId
            );
            return price
        } catch (error) {
            return false
        }
    }

    async createPriceOnStripe(subscription: SubscriptionsEntity) {
        const price = await stripe.prices.create({
            unit_amount: (subscription.amount * 100),
            currency: process.env.STRIPE_CURRENCY.toLowerCase(),
            recurring: { interval: this.tenureToStripeInterval(subscription.tenure) },
            product_data: {
                name: subscription.planType
            },
            metadata: {
                name: subscription.planType,
                price: (subscription.amount * 100)
            }
        });
        return price
    }

    tenureToStripeInterval(subscriptionTenure: TenureEnum) {
        switch (subscriptionTenure) {
            case TenureEnum.monthly:
                return 'month'
            case TenureEnum.yearly:
                return 'year'
            default:
                return 'month'
        }
    }
}
