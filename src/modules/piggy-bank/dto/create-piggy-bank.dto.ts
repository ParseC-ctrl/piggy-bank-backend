import { IsNotEmpty } from 'class-validator';
export class CreatePiggyBankDto {
  @IsNotEmpty({ message: 'userId 不能为空' })
  readonly userId: string;

  @IsNotEmpty({ message: 'piggyBankName 不能为空' })
  readonly piggyBankName: string;

  @IsNotEmpty({ message: 'amountOfdeposit 不能为空' })
  readonly amountOfdeposit: number;

  readonly total: number;
  readonly targetAmount: number;
  readonly expectedAmount: number;
}
