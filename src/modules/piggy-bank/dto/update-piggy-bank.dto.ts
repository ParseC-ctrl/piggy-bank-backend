import { IsNotEmpty } from 'class-validator';

export class UpdatePiggyBankDto {
  @IsNotEmpty({ message: 'userId 不能为空' })
  readonly userId: string;

  @IsNotEmpty({ message: 'piggyBankId 不能为空' })
  readonly piggyBankId: string;

  readonly piggyBankName: string;
  readonly total: number;
  readonly targetAmount: number;
  readonly expectedAmount: number;
}
