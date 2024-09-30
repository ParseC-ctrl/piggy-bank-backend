import { IsNotEmpty } from 'class-validator';

export class DeletePiggyBankDto {
  @IsNotEmpty({ message: 'userId 不能为空' })
  readonly userId: string;

  @IsNotEmpty({ message: 'piggyBankId 不能为空' })
  readonly piggyBankId: string;
}
