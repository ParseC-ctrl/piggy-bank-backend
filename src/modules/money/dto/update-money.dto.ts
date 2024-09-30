import { IsNotEmpty } from 'class-validator';

export class UpdateMoneyDto {
  @IsNotEmpty({ message: 'deposit_time 不能为空' })
  readonly depositTime: Date;

  @IsNotEmpty({ message: 'status 不能为空' })
  readonly status: number;
}
