import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const bearerToken = authHeader.split(' ')[1];
      const bearer = authHeader.split(' ')[0];

      if (!bearerToken || bearer !== 'Bearer') {
        throw new UnauthorizedException();
      }

      const decode = this.jwtService.verify(bearerToken, {
        secret: process.env.JWT_SECRET,
      });
      request.body.user = decode.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
