import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import Auth from 'src/auth/entity/auth.entity';
import { IToken } from 'src/token/interface/IToken';
import { TokenService } from 'src/token/token.service';

@Injectable()
export default class TokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorizaion = 'authorization';
    const token: string | string[] = req.headers[authorizaion];

    if (token === undefined || token === '') {
      throw new BadRequestException('토큰이 전송되지 않았습니다');
    }

    if (Array.isArray(token)) {
      throw new ForbiddenException('토큰은 배열이 아닙니다');
    }

    const tokenArr: string[] = token.split('Bearer ');

    if (tokenArr[0] !== '') {
      throw new ForbiddenException('토큰은 Bearer타입이어야 합니다.');
    }

    const decoded: IToken = await this.tokenService.verifyToken(tokenArr[1]);

    const member: Auth = await this.authService.getAuthById(decoded.uniqueId);

    req.user = member;

    return true;
  }
}
