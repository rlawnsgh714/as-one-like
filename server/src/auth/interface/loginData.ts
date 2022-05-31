import User from 'src/user/entity/user.entity';

export interface ILoginData {
  userData: User;
  token: string;
  refreshToken: string;
}
