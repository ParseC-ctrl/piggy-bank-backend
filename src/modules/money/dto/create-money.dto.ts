import { IsNotEmpty } from 'class-validator';

export class CreateMoneysDto {
  @IsNotEmpty({ message: 'amountOfdeposit 不能为空' })
  readonly amountOfdeposit: number;

  @IsNotEmpty({ message: 'piggyBankId 不能为空' })
  readonly piggyBankId: string;

  @IsNotEmpty({ message: 'userId 不能为空' })
  readonly userId: string;
}
