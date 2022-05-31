import Auth from 'src/auth/entity/auth.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn({
    name: 'idx',
  })
  idx!: number;

  @Column({
    name:'id',
  })
  id:string;

  @Column({
    name: 'name',
  })
  name!: string;

  @Column({
    name: 'email',
  })
  email!: string;

  @JoinColumn({ name: 'fk_auth_id' })
  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}
