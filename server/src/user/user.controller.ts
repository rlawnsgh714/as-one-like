import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import Auth from 'src/auth/entity/auth.entity';
import { Token } from 'src/global/decorator/token.decorator';
import TokenGuard from 'src/global/guard/token.guard';
import BaseResponse from 'src/global/response/response';
import response from 'src/global/response/response';
import JoinDto from './dto/join.dto';
import UserDto from './dto/user.dto';
import User from './entity/user.entity';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers(): Promise<BaseResponse<User[]>> {
    const userData: User[] = await this.userService.getUsers();
    return response.successResponse('모든 회원 정보 조회 성공');
  }

  @Get('/:id')
  async getUserByIdx(@Param('id') id: string): Promise<BaseResponse<User>> {
    const userData: User = await this.userService.getUserByIdx(id);
    return response.successResponse('해당 ID에 맞는 회원 정보 조회 성공');
  }

  @UseGuards(TokenGuard)
  @Post('/')
  async addUser(
    @Token() user: User,
    @Body() joinDto: JoinDto,
  ): Promise<BaseResponse<User>> {
    await this.userService.addUser(user.id, joinDto);
    return response.successResponse('유저 추가 성공');
  }

  @UseGuards(TokenGuard)
  @Put('/:id')
  async modifyUser(
    @Token() user: Auth,
    @Body() userDto: UserDto,
  ): Promise<BaseResponse<User>> {
    await this.userService.modifyUser(user.id, userDto);
    return response.successResponse('해당 아이디에 맞는 회원 정보 수정 성공');
  }

  @UseGuards(TokenGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<BaseResponse<User>> {
    await this.userService.deleteUser(id);
    return response.successResponse('해당 아이디에 맞는 회원 정보 삭제 성공');
  }
}
