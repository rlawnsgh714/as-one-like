import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UserDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  eamil!: string;
}
