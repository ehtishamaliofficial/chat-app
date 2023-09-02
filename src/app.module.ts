import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ChatModule, UserModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
