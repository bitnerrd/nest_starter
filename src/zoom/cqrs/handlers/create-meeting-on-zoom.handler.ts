import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ZoomService } from 'src/zoom/zoom.service';
import { CreateMeetingOnZoomEvent } from '../events/create-meeting-on-zoom.event';

@EventsHandler(CreateMeetingOnZoomEvent)
export class CreateMeetingOnZoomHandler implements IEventHandler<CreateMeetingOnZoomEvent> {
    constructor(
        private readonly zoomService: ZoomService
    ) {
    }


    async handle(command: CreateMeetingOnZoomEvent): Promise<any> {

        await this.zoomService.createMeetings({
            organizerZoomUserId: command.organizerZoomUserId,
            participantZoomUserId: command.participantZoomUserId,
            meetingAgenda: command.meetingAgenda,
        });


        return Promise.resolve(undefined);
    }

}