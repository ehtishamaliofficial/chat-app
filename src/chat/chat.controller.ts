import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Post()
  async create(
    @Body()
    createChatDto: CreateChatDto,
  ) {
    return this.chatService.create(createChatDto.users);
  }

  @Post('/send-message')
  async sendMessage(@Body() message: MessageDTO) {
    return this.chatService.sendMessage(message);
  }
}
