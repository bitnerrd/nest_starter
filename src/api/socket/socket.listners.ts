import { Server } from "socket.io";
import {
  AuthSocket,
  SocketCommands,
  SocketEvents,
  SocketListeners,
} from "./socket.interfaces";
import { SocketEmitter } from "./socket.emitters";
import { UserServices } from "../user/user.service";

export class SocketListners {
  constructor(
    private socketEmitter: SocketEmitter,
    private userService: UserServices
  ) {}

  public onMessage(socket: AuthSocket, server: Server, userId: string) {
    socket.on("message", (data) => {
      this.socketEmitter.emit(SocketEvents.MESSAGE, userId, data);
    });
  }

  // public onBulkTrades(socket: AuthSocket, server: Server, userId: string) {
  //   socket.on(SocketListeners.bulkTrades, async (data) => {
  //     const trades = await this.tradesService.createBulkTrades(
  //       data,
  //       socket.user
  //     );
  //     this.socketEmitter.emit("notification", userId, trades.data);
  //   });
  // }

  public onNotifications(socket: AuthSocket, server: Server, userId: string) {
    socket.on(SocketListeners.notifications, async (payload) => {
      const command = payload.COMMAND;

      switch (command) {
        case SocketCommands.GET_NOTIFICATIONS:
          const notifications = await this.userService.getNotifications(
            socket.user
          );
          this.socketEmitter.emit(
            SocketEvents.NOTIFICATIONS,
            userId,
            notifications
          );
          break;
        case SocketCommands.SEEN:
          await this.userService.seenNotification(
            socket.user,
            payload.notificationId
          );
          break;

        case SocketCommands.NOTIFICATIONS_COUNT:
          const count = await this.userService.getNotificationsCount(
            socket.user
          );
          this.socketEmitter.emit(SocketEvents.NOTIFICATIONS, userId, count);
          break;
        default:
          this.socketEmitter.emit(SocketEvents.NOTIFICATIONS, userId, {
            message:
              "Invalid Command, Please Contact Backend Team for Support, You DUMB Peoples, You are not supposed to be here, ",
          });
          break;
      }
    });
  }

  public onDisconnect(socket: AuthSocket) {
    // socket.on("disconnect", () => {
    //   console.log(`Email: ${socket?.user?.email} Disconnected`);
    // });
  }
}
