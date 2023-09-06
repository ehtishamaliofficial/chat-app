import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageDTO } from './dto/message.dto';
import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';

@WebSocketGateway(8000, {
  cors: {
    origin: '*',
  },
})
// @UseGuards(AuthGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  private loggar = new Logger(ChatGateway.name);
  handleConnection(client: Socket, ...args: any[]) {
    this.loggar.log('A user connected ', client.id);
  }

  handleDisconnect(client: Socket) {
    this.loggar.log('A user disconnected ', client.id);
  }

  afterInit(server: any) {
    Logger.log('WebSocket Initialized!');
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: string) {
    console.log(payload);
    this.server.emit('receiveMessage', payload);
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(client: Socket, payload: MessageDTO) {
    console.log(payload);
    this.server.to(payload.chatId).emit('receiveMessage', payload);
    return 'ok';
  }

  @SubscribeMessage('ChatList')
  handleChatList(client: Socket, payload: string) {
    const data = this.chatService.getChats(payload);
    return data;
  }
}
