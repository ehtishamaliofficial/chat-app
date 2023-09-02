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
import { Logger } from '@nestjs/common';

@WebSocketGateway(8000, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('a user connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('a user disconnected', client.id);
  }

  afterInit(server: any) {
    Logger.log('WebSocket Initialized!');
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: MessageDTO) {
    console.log(payload);
    this.server.emit('receiveMessage', payload);
  }
}
