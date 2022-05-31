import { Body, Controller, Post } from '@nestjs/common';
import BaseResponse from 'src/global/response/response';
import response from 'src/global/response/response';
import User from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import CodeLogin from './dto/codeLogin';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async getCodeLogin(
    @Body() codeLogin: CodeLogin,
  ): Promise<BaseResponse<User>> {
    const code = await this.authService.getCodeLogin(codeLogin);
    const user = await this.authService.dodamLogin(code);
    return response.successResponse('', user);
  }
}
