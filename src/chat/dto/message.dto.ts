import { IsString } from 'class-validator';

export class MessageDTO {
  @IsString()
  content: string;

  @IsString()
  sender: string;

  @IsString()
  receiver: string;

  @IsString()
  chatId: string;
}
