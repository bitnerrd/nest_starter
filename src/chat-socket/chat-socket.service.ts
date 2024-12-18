import { Injectable } from '@nestjs/common';
import { ContactsEntity } from 'src/entities/contacts/contacts.entity';
import { ContactRequestStatusEnum } from 'src/utils/enums/enums';
import { getConnection, getRepository } from 'typeorm';
import { MessagesEntity } from '../entities/messages/messages.entity';

@Injectable()
export class ChatSocketService {
  constructor() {}

  // async create(payload: any) {
  //   const { userId, attachment, ...rest } = payload;
  //   rest['attachment'] = attachment?.id || null;
  //   await this.messagesService.createMessage(userId, rest);
  // }

  async findRoomMessages(room: string) {
    return 1;
  }

  async unreadChatsCount(userId) {
    const contacts = await ContactsEntity.createQueryBuilder('contact')
      .where(
        '(contact.fromOrSender = :userId OR contact.toOrReceiver = :userId)',
        { userId },
      )
      .andWhere('contact.status = :status', {
        status: ContactRequestStatusEnum.ACCEPTED,
      })
      .select('contact.roomId')
      .getMany();

    const roomIds = contacts.map((contact) => contact.roomId);

    const messagesCount = await MessagesEntity.createQueryBuilder('message')
      .where('message.room_id IN (:...roomIds)', { roomIds })
      .andWhere(
        'message.isSeen = :isSeen AND message.user_id != :user AND message.deleted_by IS NULL',
        { isSeen: false, user: userId },
      )
      .getCount();

    return messagesCount;
  }
}
