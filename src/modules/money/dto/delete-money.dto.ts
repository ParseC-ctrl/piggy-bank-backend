import { IsNotEmpty } from 'class-validator';

export class DeleteMoneysDto {
  @IsNotEmpty({ message: 'piggyBankId 不能为空' })
  readonly piggyBankId: string;

  @IsNotEmpty({ message: 'userId 不能为空' })
  readonly userId: string;
}
