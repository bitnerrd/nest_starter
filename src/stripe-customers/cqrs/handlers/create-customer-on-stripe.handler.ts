import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StripeCustomersService } from 'src/stripe-customers/stripe-customers.service';
import { CreateCustomerOnStripeEvent } from '../events/create-customer-on-stripe.event';

@EventsHandler(CreateCustomerOnStripeEvent)
export class CreateCustomerOnStripeHandler implements IEventHandler<CreateCustomerOnStripeEvent> {
    constructor(
        private readonly stripeCustomersService: StripeCustomersService
    ) {
    }


    async handle(command: CreateCustomerOnStripeEvent): Promise<any> {

        await this.stripeCustomersService.createCustomerOnStripeAndUpdateUser(command.userId, command.email, command.stripeCustomerId);


        return Promise.resolve(undefined);
    }

}