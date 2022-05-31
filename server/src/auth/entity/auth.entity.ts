import User from 'src/user/entity/user.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('auth')
export default class Auth {
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'access_level',
  })
  accessLevel: number;

  @Column({
    name: 'profile_image',
    default: '',
    nullable: true,
  })
  profileImage: string;

  @OneToOne(() => User, (user) => user.auth)
  user: User;
}
