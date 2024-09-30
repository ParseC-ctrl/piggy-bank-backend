import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'nickname 不能为空' })
  readonly nickname: string;
  @IsNotEmpty({ message: 'password 不能为空' })
  readonly password: string;
}
