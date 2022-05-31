import Auth from '../entity/auth.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  public findAuthById(id: string): Promise<Auth> {
    return this.createQueryBuilder('auth').where('id = :id', { id }).getOne();
  }
}
