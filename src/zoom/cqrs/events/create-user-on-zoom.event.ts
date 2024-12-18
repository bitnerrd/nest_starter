export class CreateUserOnZoomEvent {
    constructor(
        public readonly email: string,
        public readonly first_name: string,
        public readonly last_name: string,
    ) {
    }
}