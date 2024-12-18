import { Meetings } from "src/entities/meetings/meetings.entity";

export class CreateMeetingOnZoomEvent {
    constructor(
        public readonly organizerZoomUserId: string,
        public readonly participantZoomUserId: string,
        public readonly meetingAgenda: string,
    ) {
    }
}