import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { MessageDTO } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(users: string[]) {
    try {
      const users1 = await this.prisma.user.findUnique({
        where: {
          id: users[0],
        },
      });
      const users2 = await this.prisma.user.findUnique({
        where: {
          id: users[1],
        },
      });

      if (!users1 || !users2) {
        throw new BadRequestException('User not found');
      }
      const chat = await this.prisma.chat.create({
        data: {
          users: {
            connect: [
              {
                id: users[0],
              },
              {
                id: users[1],
              },
            ],
          },
        },
      });
      return {
        success: true,
        message: 'Chat created successfully',
        data: chat,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendMessage(message: MessageDTO) {
    try {
      const data = await this.prisma.message.create({
        data: {
          content: message.content,
          sender: {
            connect: {
              id: message.sender,
            },
          },
          receiver: {
            connect: {
              id: message.receiver,
            },
          },
          chat: {
            connect: {
              id: message.chatId,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Message sent successfully',
        data: data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
