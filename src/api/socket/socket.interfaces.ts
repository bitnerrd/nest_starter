import { Socket } from "socket.io";
import { IUser } from "src/common/interfaces/user.interface";

export interface AuthSocket extends Socket {
  user: IUser;
}

export enum SocketListeners {
  message = "message",
  join = "join",
  notifications = "notifications",
  bulkTrades = "bulk_trades",
}

export enum SocketCommands {
  GET_NOTIFICATIONS = "notifications",
  SEEN = "seen_notification",
  NOTIFICATIONS_COUNT = "notifications_count",
}

export enum SocketEvents {
  NOTIFICATIONS = "notifications",
  MESSAGE = "message",
  JOIN = "join",
}
