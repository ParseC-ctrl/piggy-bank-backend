import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePiggyBankDto } from './dto/create-piggy-bank.dto';
import { UpdatePiggyBankDto } from './dto/update-piggy-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PiggyBank } from './entities/piggy-bank.entity';
import { Repository } from 'typeorm';
import { DeletePiggyBankDto } from './dto/delete-piggy-bank.dto';
import { MoneyService } from '../money/money.service';
import { CreateMoneysDto } from '../money/dto/create-money.dto';
import { GetPiggyBankDto } from './dto/get-piggy-bank.dto';
import { Money } from '../money/entities/money.entity';

@Injectable()
export class PiggyBankService {
  constructor(
    @InjectRepository(PiggyBank)
    private readonly piggyBankRepository: Repository<PiggyBank>,
    private readonly moneyService: MoneyService,

    @InjectRepository(Money)
    private readonly moneyRepository: Repository<Money>,
  ) {}
  async createPiggyBank(createPiggyBankDto: CreatePiggyBankDto) {
    const { amountOfdeposit, ...piggyBankInfo } = createPiggyBankDto;
    const { piggyBankName, userId } = createPiggyBankDto;
    const exist = await this.piggyBankRepository.findOneBy({
      userId,
      piggyBankName,
    });

    if (exist) throw new ForbiddenException('该存钱罐名称已存在');
    const piggyBank = new PiggyBank();
    Object.assign(piggyBank, piggyBankInfo);
    const savedPiggyBank = await this.piggyBankRepository.save(piggyBank);
    const createMoneysDto: CreateMoneysDto = {
      amountOfdeposit: amountOfdeposit,
      piggyBankId: savedPiggyBank.piggyBankId,
      userId: piggyBankInfo.userId,
    };

    await this.moneyService.createMoneys(createMoneysDto);

    return {
      info: savedPiggyBank,
      message: '创建存钱罐成功！',
    };
  }

  async updatePiggyBank(updatePiggyBankDto: UpdatePiggyBankDto) {
    const { piggyBankId, userId, ...updatePiggyBankData } = updatePiggyBankDto;

    const result = await this.piggyBankRepository.update(
      { piggyBankId, userId },
      updatePiggyBankData,
    );

    if (result.affected === 0) {
      throw new NotFoundException('该存钱罐不存在');
    }

    return {
      info: await this.piggyBankRepository.findOneBy({ piggyBankId, userId }),
      message: '更新存钱罐成功',
    };
  }

  async removePiggyBank(deletePiggyBankDto: DeletePiggyBankDto) {
    const { userId, piggyBankId } = deletePiggyBankDto;
    const piggyBank = await this.piggyBankRepository.findOneBy({
      piggyBankId,
      userId,
    });
    if (!piggyBank) throw new NotFoundException('该存钱罐不存在');
    const result = await this.piggyBankRepository.delete({
      piggyBankId,
      userId,
    });
    return {
      info: result,
      message: '删除存钱罐成功',
    };
  }

  async getPiggyBank(getPiggyBankDto: GetPiggyBankDto) {
    const { userId } = getPiggyBankDto;

    // 查询所有匹配的 PiggyBank
    const piggyBanks = await this.piggyBankRepository
      .createQueryBuilder('pb')
      .where('pb.user_id = :userId', { userId })
      .getMany();

    if (piggyBanks.length === 0) {
      return {
        code: 404,
        message: '存钱罐不存在',
      };
    }

    // 假设只返回第一个匹配的 PiggyBank
    const piggyBank = piggyBanks[0];

    // 获取 PiggyBank 对应的 Money 数据
    const moneyRecords = await this.moneyRepository
      .createQueryBuilder('m')
      .where('m.piggy_bank_id = :piggyBankId AND m.user_id = :userId', {
        piggyBankId: piggyBank.piggyBankId,
        userId,
      })
      .orderBy('m.amount', 'ASC') // 按 amount 从小到大排序
      .getMany();

    // 过滤掉 moneyId 字段
    const filteredMoneyRecords = moneyRecords.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ moneyId, userId, piggyBankId, ...rest }) => rest,
    );

    // 将 Money 数据添加到 PiggyBank 对象
    const result = {
      ...piggyBank,
      filteredMoneyRecords,
    };

    return {
      info: result,
      message: '查询成功',
    };
  }
}
