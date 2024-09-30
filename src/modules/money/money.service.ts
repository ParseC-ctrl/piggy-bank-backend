import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMoneysDto } from './dto/create-money.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Money } from './entities/money.entity';
import { Repository } from 'typeorm';
import { PiggyBank } from '../piggy-bank/entities/piggy-bank.entity';
import { UpdateMoneyDto } from './dto/update-money.dto';
import { DeleteMoneysDto } from './dto/delete-money.dto';

@Injectable()
export class MoneyService {
  constructor(
    @InjectRepository(Money)
    private readonly moneyRepository: Repository<Money>,
    @InjectRepository(PiggyBank)
    private readonly piggyBankRepository: Repository<PiggyBank>,
  ) {}
  async createMoneys(createMoneysDto: CreateMoneysDto) {
    const { amountOfdeposit, piggyBankId, userId } = createMoneysDto;
    const moneys = [];
    // 查找是否存在对应的存钱罐
    const existPiggyBank = await this.piggyBankRepository.findOne({
      where: { piggyBankId: piggyBankId, userId: userId },
    });

    if (!existPiggyBank) {
      throw new NotFoundException('未找到对应存钱罐');
    }
    for (let i = 1; i <= amountOfdeposit; i++) {
      const money = this.moneyRepository.create({
        amount: i,
        piggyBankId,
        userId,
      });
      moneys.push(money);
    }

    // 使用 save 方法进行批量插入
    const result = await this.moneyRepository.save(moneys);

    return {
      info: result,
      message: '创建数额成功！',
    };
  }

  async updateMoney(moneyId: string, updateMoneyDto: UpdateMoneyDto) {
    const money = await this.moneyRepository.findOneBy({
      moneyId: moneyId,
    });
    if (!money) {
      throw new NotFoundException('未找到对应的金额记录');
    }

    const { depositTime, status } = updateMoneyDto;

    money.depositTime = depositTime;
    money.status = status;

    const updatedMoney = await this.moneyRepository.save(money);

    return {
      info: updatedMoney,
      message: '更新金额成功！',
    };
  }

  async deleteMoneys(deleteMoneysDto: DeleteMoneysDto) {
    const { piggyBankId, userId } = deleteMoneysDto;

    const piggyBank = await this.piggyBankRepository.findOne({
      where: { piggyBankId, userId },
    });

    if (!piggyBank) {
      throw new NotFoundException('未找到对应的存钱罐');
    }

    // 查找到所有匹配的 Money 实体
    const moneys = await this.moneyRepository.find({
      where: { piggyBankId, userId },
    });

    if (!moneys.length) {
      throw new NotFoundException('暂未设定存钱罐存款数额');
    }

    const result = await this.moneyRepository.remove(moneys);

    return {
      info: result,
      message: '批量删除金额成功！',
    };
  }
}
