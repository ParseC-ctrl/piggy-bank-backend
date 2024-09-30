import { Module } from '@nestjs/common';
import { PiggyBankService } from './piggy-bank.service';
import { PiggyBankController } from './piggy-bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiggyBank } from './entities/piggy-bank.entity';
import { MoneyService } from '../money/money.service';
import { Money } from '../money/entities/money.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PiggyBank, Money])],
  controllers: [PiggyBankController],
  providers: [PiggyBankService, MoneyService],
})
export class PiggyBankModule {}
