import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MoneyService } from './money.service';
import { CreateMoneysDto } from './dto/create-money.dto';
import { UpdateMoneyDto } from './dto/update-money.dto';
import { DeleteMoneysDto } from './dto/delete-money.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Post('create')
  // @UseGuards(AuthGuard('jwt'))
  create(@Body() createMoneyDto: CreateMoneysDto) {
    return this.moneyService.createMoneys(createMoneyDto);
  }

  @Put('update')
  // @UseGuards(AuthGuard('jwt'))
  updateMoney(
    @Query('moneyId') moneyId: string,
    @Body() updateMoneyDto: UpdateMoneyDto,
  ) {
    return this.moneyService.updateMoney(moneyId, updateMoneyDto);
  }

  @Delete('delete')
  // @UseGuards(AuthGuard('jwt'))
  async deleteMoneys(@Body() deleteMoneysDto: DeleteMoneysDto) {
    return this.moneyService.deleteMoneys(deleteMoneysDto);
  }
}
