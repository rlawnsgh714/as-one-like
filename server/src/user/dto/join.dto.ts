import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class JoinDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!:string

  @IsNotEmpty()
  @IsString()
  email!: string;
}
