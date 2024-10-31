import { Injectable, Inject } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class SocketEmitter {
  constructor(@Inject("SOCKET_SERVER") public server: Server) {}

  emit(event: string, userId: string, data: any): void {
    this.server.to(userId).emit(event, data);
  }

  broadcast(event: string, data: any): void {
    this.server.emit(event, data);
  }
}
