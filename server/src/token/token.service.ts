import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IToken, ITokenPayload } from './interface/IToken';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken(token: string): IToken {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      switch (error.message) {
        case 'jwt must be provided':
          throw new BadRequestException('토큰이 전송되지 않았습니다');

        case 'invalid signature':
        case 'invalid token':
        case 'jwt malformed':
          throw new UnauthorizedException('유효하지 않은 토큰');

        case 'jwt expired':
          throw new UnauthorizedException('만료된 토큰');

        default:
          throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  generateAccessToken(uniqueId: string): string {
    const Payload: ITokenPayload = {
      uniqueId,
    };

    const Options: JwtSignOptions = {
      expiresIn: '100d',
      issuer: 'blog',
      subject: 'accessToken',
    };

    return this.jwtService.sign(Payload, Options);
  }

  generateRefreshToken(uniqueId: string): string {
    const Payload: ITokenPayload = {
      uniqueId,
    };

    const Options: JwtSignOptions = {
      expiresIn: '5d',
      issuer: 'blog',
      subject: 'refreshToken',
    };

    return this.jwtService.sign(Payload, Options);
  }

  remakeAccessToken(token: string): string[] {
    const { iss, uniqueId, sub }: IToken = this.verifyToken(token);

    if (iss !== 'blog' || sub !== 'refreshToken') {
      throw new BadRequestException('위조된 토큰');
    }

    const accessToken = this.generateAccessToken(uniqueId);
    const refreshToken = this.generateRefreshToken(uniqueId);
    return [accessToken, refreshToken];
  }
}
