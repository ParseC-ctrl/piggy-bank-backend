import { IsNotEmpty } from 'class-validator';

export class GetPiggyBankDto {
  @IsNotEmpty({ message: 'userId 不能为空' })
  readonly userId: string;
}
