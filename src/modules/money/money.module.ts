import { Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Money } from './entities/money.entity';
import { PiggyBank } from '../piggy-bank/entities/piggy-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Money, PiggyBank])],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
