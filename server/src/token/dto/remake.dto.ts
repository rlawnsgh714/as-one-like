import { IsNotEmpty, IsString } from 'class-validator';

export default class RemakeDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
