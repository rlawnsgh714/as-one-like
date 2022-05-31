import User from '../entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public getUsers(): Promise<User[]> {
    return this.createQueryBuilder('user').getMany();
  }

  public getUserById(id: string): Promise<User> {
    return this.createQueryBuilder('user').where('id = :id', { id }).getOne();
  }

  public getFkAuthById(id: string): Promise<User> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.auth', 'auth')
      .where('auth.id = :id', { id })
      .getOne();
  }
}
