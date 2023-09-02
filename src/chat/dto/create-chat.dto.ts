import { IsArray, Max } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  users: string[];
}
