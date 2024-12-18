import { Module } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { ZoomController } from './zoom.controller';
import { HttpModule } from '@nestjs/axios';
import { CreateUserOnZoomHandler } from './cqrs/handlers/create-user-on-zoom.handler';
import { AuthModule } from 'src/auth/auth.module';
import { CreateMeetingOnZoomHandler } from './cqrs/handlers/create-meeting-on-zoom.handler';

@Module({
  imports: [HttpModule],
  controllers: [ZoomController],
  providers: [
    CreateUserOnZoomHandler,
    CreateMeetingOnZoomHandler,
    ZoomService
  ],
  exports: [ZoomService]
})
export class ZoomModule { }
