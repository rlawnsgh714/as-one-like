import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { validationData } from 'src/global/utils/validationData.util';
import JoinDto from './dto/join.dto';
import UserDto from './dto/user.dto';
import User from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    const userData: User[] = await this.userRepository.getUsers();
    return userData;
  }

  async getUserByIdx(id: string): Promise<User> {
    const userData: User = await this.userRepository.getUserById(id);
    return userData;
  }

  async addUser(id: string, joinDto: JoinDto): Promise<void> {
    const checkUser: User = await this.userRepository.getUserById(joinDto.id);
    console.log(checkUser);
    if (validationData(checkUser) === false) {
      throw new UnauthorizedException('이미 존재하는 아이디입니다');
    }
    await this.userRepository.save({
      ...joinDto,
      fk_auth_id: id,
    });
  }

  async modifyUser(id: string, userDto: UserDto): Promise<void> {
    const checkUser: User = await this.userRepository.getFkAuthById(id);
    if (validationData(checkUser) === false) {
      throw new NotFoundException('해당 회원은 존재하지 않습니다');
    }
    const userData: User = await this.userRepository.merge(checkUser, userDto);
    await this.userRepository.save(userData);
  }

  async deleteUser(id: string): Promise<void> {
    const checkUser: User = await this.userRepository.getUserById(id);
    if (validationData(checkUser)) {
      throw new NotFoundException('해당 회원은 존재하지 않습니다');
    }
    await this.userRepository.delete(checkUser);
  }
}
