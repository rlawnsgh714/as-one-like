import { Body, Controller, Post, Query } from '@nestjs/common';
import response from 'src/global/response/response';
import RemakeDto from './dto/remake.dto';
import { IToken } from './interface/IToken';
import { TokenService } from './token.service';

@Controller('/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/verify')
  async verifyToken(@Query('token') accessToken: string) {
    const token: IToken = await this.tokenService.verifyToken(accessToken);
    return response.successResponse('토큰이 확인 되었습니다', token);
  }

  @Post('/refresh')
  async remakeToken(@Body() dto: RemakeDto) {
    const accessToken: string[] = await this.tokenService.remakeAccessToken(
      dto.token,
    );
    return response.successResponse('토큰이 재발급 되었습니다', accessToken);
  }
}
