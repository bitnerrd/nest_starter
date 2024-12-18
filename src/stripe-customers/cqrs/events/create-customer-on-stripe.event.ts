export class CreateCustomerOnStripeEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly stripeCustomerId: string | null,
    ) {
    }
}