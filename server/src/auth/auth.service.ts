import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { validationData } from 'src/global/utils/validationData.util';
import { TokenService } from 'src/token/token.service';
import CodeLogin from './dto/codeLogin';
import Auth from './entity/auth.entity';
import { ILoginData } from './interface/loginData';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
  ) {}

  async getAuthById(id: string): Promise<Auth> {
    const user: Auth | undefined = await this.authRepository.findAuthById(id);
    if (validationData(user)) {
      throw new UnauthorizedException('회원이 없습니다');
    }
    return user;
  }

  async getCodeLogin(codeLogin: CodeLogin) {
    const DAUTH_SERVER: string = await this.configService.get<string>(
      'DAUTH_SERVER',
    );
    const clientId: string = await this.configService.get<string>('ClIENT_ID');
    const redirectUrl: string = await this.configService.get<string>(
      'redirectUrl',
    );
    const res: AxiosResponse = await axios.post(
      `http://${DAUTH_SERVER}/api/auth/login`,
      {
        id: codeLogin.id,
        pw: codeLogin.pw,
        clientId: clientId,
        redirectUrl: redirectUrl,
      },
    );
    const code = res.data.data.location.split('=')[1].split('&')[0];
    return code;
  }

  async dodamLogin(code: string): Promise<ILoginData> {
    const DAUTH_SERVER: string = await this.configService.get<string>(
      'DAUTH_SERVER',
    );
    const OPEN_SERVER: string = await this.configService.get<string>(
      'OPEN_SERVER',
    );
    const ClIENT_ID: string = this.configService.get<string>('ClIENT_ID');
    const CLIENT_SECRET: string =
      this.configService.get<string>('CLIENT_SECRET');

    const res: AxiosResponse = await axios.post(
      `http://${DAUTH_SERVER}/api/token`,
      {
        code: code,
        client_id: ClIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    );
    const result: AxiosResponse = await axios.get(
      `http://${OPEN_SERVER}/api/user`,
      {
        headers: {
          Authorization: 'Bearer ' + res.data.access_token,
        },
      },
    );

    const userData = result.data.data;

    let user: Auth = await this.authRepository.findAuthById(userData.uniqueId);

    if (validationData(user)) {
      user = this.authRepository.create({
        id: userData.uniqueId,
        name: userData.name,
        accessLevel: userData.accessLevel,
        profileImage: userData.profileImage,
      });
      await this.authRepository.save(user);
    }

    const token: string = await this.tokenService.generateAccessToken(
      result.data.uniqueId,
    );
    const refreshToken: string = await this.tokenService.generateRefreshToken(
      result.data.id,
    );
    if (validationData(token) || validationData(refreshToken)) {
      throw new ForbiddenException('토큰이 발급되지 않았습니다');
    }
    return { userData, token, refreshToken };
  }
}
