import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets/decorators';
import { Socket, Server } from 'socket.io';
import { ChatSocketService } from './chat-socket.service';
import { Logger } from '@nestjs/common';
import { ClientSocketInfo } from './clientSocketInfo';
import { RoomInfo } from './roomInfo';

@WebSocketGateway(4000, {
  cors: true,
})
export class ChatSocketGateway {
  @WebSocketServer()
  server: Server;
  private lstClients = [];
  private lstRooms = [];
  private logger: Logger = new Logger('SocketsGateway');

  constructor(private readonly chatSocketService: ChatSocketService) {}

  @SubscribeMessage('createChatSocket')
  async create(client: Socket, payload: any) {
    // const message = await this.chatSocketService.create(payload);
    const room = this.getRoomOfClient(client);
    this.server.to(room).emit('message', payload);
    this.server.emit('incomingMessage', true);
  }

  @SubscribeMessage('findAllChatSocket')
  async findRoomMessages(client: Socket, room: string) {
    this.logger.log('Find Room Chat ' + room);
    return await this.chatSocketService.findRoomMessages(room);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, { userId, room }): void {
    this.logger.log('joinRoom : ' + room);
    this.addClient(client, userId, room);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('typing')
  public typing(client: Socket, payload: any): void {
    client.broadcast.emit('typing', payload);
  }

  @SubscribeMessage('unreadChatsCount')
  async unreadChatsCount(client: Socket, userId: string) {
    const count = await this.chatSocketService.unreadChatsCount(userId);
    this.server.emit('unreadChatsCountNav', count);
  }

  addClient(client: Socket, sender_id: string, room: string) {
    const c = new ClientSocketInfo(client.id, room, sender_id);
    this.lstClients.push(c);

    const objRoom = this.lstRooms.find((o) => o.RoomID === room);
    if (objRoom === undefined) {
      const rm = new RoomInfo(room);
      rm.UserMessages = [];
      this.lstRooms.push(rm);
    }
  }

  getRoomOfClient(client: Socket): string {
    let res = '';
    const objClient = this.lstClients.find((o) => {
      return o.ClientID === client.id;
    });
    if (objClient != undefined) {
      res = objClient.RoomID;
    }
    return res;
  }
}
