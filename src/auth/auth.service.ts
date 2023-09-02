import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { isMatch } from 'utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email Or Password Incorrect');
    }

    const passwordMatch = await isMatch(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email Or Password Incorrect');
    }

    const token = await this.jwtService.sign({
      ...user,
      password: undefined,
    });

    return {
      success: true,
      message: 'User logged in successfully',
      token,
      user: { ...user, password: undefined },
    };
  }
}
