import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthSocket, SocketEvents } from "./socket.interfaces";
import { AuthService } from "../auth/auth.service";
import { IUser } from "src/common/interfaces/user.interface";
import { SocketListners } from "./socket.listners";
import { SocketEmitter } from "./socket.emitters";
import { UserServices } from "../user/user.service";

@WebSocketGateway()
export class SocketConnection implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private socketEmitter: SocketEmitter, // Inject SocketEmitter
    private userService: UserServices
  ) {}

  onModuleInit() {
    const listeners = new SocketListners(this.socketEmitter, this.userService);

    this.server
      .use(async (socket: AuthSocket, next) => {
        try {
          const token = socket.handshake.query.token as string;
          const user: IUser = await this.authService.getUserByToken(token);

          if (user) {
            socket.user = user;
            next();
          } else {
            throw new Error("Unauthorized");
          }
        } catch (error) {
          console.error(error);
          next(new Error("Unauthorized"));
        }
      })
      .on("connection", (socket: AuthSocket) => {
        this.socketEmitter.server = this.server;

        if (socket?.user?.role == "admin") {
          socket.join("admin");
        } else {
          socket.join(socket.user.profile._id.toString());
        }
        // console.log(`Email: ${socket?.user?.email} Joined`);

        this.socketEmitter.emit(
          SocketEvents.JOIN,
          socket?.user?.profile._id.toString(),
          {
            message: `Welcome to Socket! ${socket?.user?.email}`,
          }
        );

        listeners.onMessage(
          socket,
          this.server,
          socket.user.profile._id.toString()
        );
        // listeners.onBulkTrades(
        //   socket,
        //   this.server,
        //   socket.user.profile._id.toString()
        // );

        listeners.onNotifications(
          socket,
          this.server,
          socket.user.profile._id.toString()
        );
        listeners.onDisconnect(socket);
      });
  }
}
