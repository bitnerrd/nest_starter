import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { UserEntity } from 'src/entities/user/user.entity';
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
export class StripeCustomersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async createCustomerOnStripeAndUpdateUser(userId: string, email: string, stripeCustomerId: string | null) {
        const customerExists = await this.searchACustomerFromStripe(userId, email)
        if (customerExists && !stripeCustomerId) {
            return await this.updateUser(email, customerExists.id)
        }
        const customer = await this.createCustomerOnStripe(userId, email)
        return await this.updateUser(email, customer.id)
    }

    async updateUser(email: string, stripeCustomerId: string) {
        return await this.userRepository.update({ email }, { stripeCustomerId })
    }

    async createCustomerOnStripe(userId: string, email: string) {
        return await stripe.customers.create({
            email: email,
            metadata: {
                user_id: userId
            }
        });
    }

    async searchACustomerFromStripe(userId: string, email: string) {
        const customer = await stripe.customers.search({
            query: `
            email~"${email}"
            AND 
            metadata['user_id']:"${userId}"
            `,
        });
        console.log(customer)
        if (customer.data.length > 0) {
            return customer.data[0]
        }
        return false
    }
}
