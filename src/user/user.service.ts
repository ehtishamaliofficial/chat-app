import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hashed } from 'utils/bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { name, username, email, password } = createUserDto;
      const isExist = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (isExist) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await hashed(password);

      await this.prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        },
      });

      return {
        success: true,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
