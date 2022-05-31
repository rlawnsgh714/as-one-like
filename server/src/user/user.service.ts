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

  async addUser(user: User, joinDto: JoinDto): Promise<void> {
    const checkUser: User = await this.userRepository.getUserById(joinDto.id);
    if (validationData(checkUser) === false) {
      throw new UnauthorizedException('이미 존재하는 아이디입니다');
    }
    await this.userRepository.save({
      ...joinDto,
      auth: user,
    });
  }

  async modifyUser(user: User, userDto: UserDto): Promise<void> {
    const checkUser: User = await this.userRepository.getFkAuthById(user.id);
    if (validationData(checkUser)) {
      throw new NotFoundException('해당 회원은 존재하지 않습니다');
    }
    const userData: User = await this.userRepository.merge(checkUser, userDto);
    await this.userRepository.save(userData);
  }

  async deleteUser(user: User): Promise<void> {
    const checkUser: User = await this.userRepository.getFkAuthById(user.id);
    if (validationData(checkUser)) {
      throw new NotFoundException('해당 회원은 존재하지 않습니다');
    }
    await this.userRepository.delete(checkUser);
  }
}
