import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StripeCustomersService } from 'src/stripe-customers/stripe-customers.service';
import { ZoomService } from 'src/zoom/zoom.service';
import { CreateUserOnZoomEvent } from '../events/create-user-on-zoom.event';

@EventsHandler(CreateUserOnZoomEvent)
export class CreateUserOnZoomHandler implements IEventHandler<CreateUserOnZoomEvent> {
    constructor(
        private readonly zoomService: ZoomService
    ) {
    }


    async handle(command: CreateUserOnZoomEvent): Promise<any> {

        await this.zoomService.createUser({
            email: command.email,
            first_name: command.first_name,
            last_name: command.last_name,
        });


        return Promise.resolve(undefined);
    }

}