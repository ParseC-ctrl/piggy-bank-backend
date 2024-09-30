import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { PiggyBankService } from './piggy-bank.service';
import { CreatePiggyBankDto } from './dto/create-piggy-bank.dto';
import { UpdatePiggyBankDto } from './dto/update-piggy-bank.dto';
import { DeletePiggyBankDto } from './dto/delete-piggy-bank.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetPiggyBankDto } from './dto/get-piggy-bank.dto';

@Controller('piggy-bank')
export class PiggyBankController {
  constructor(private readonly piggyBankService: PiggyBankService) {}

  @Get('check/:userId')
  // @UseGuards(AuthGuard('jwt'))
  checkPiggyBank(@Param() userId: GetPiggyBankDto) {
    return this.piggyBankService.getPiggyBank(userId);
  }

  @Post('create')
  // @UseGuards(AuthGuard('jwt'))
  createPiggyBank(@Body() createPiggyBankDto: CreatePiggyBankDto) {
    return this.piggyBankService.createPiggyBank(createPiggyBankDto);
  }

  @Put('update')
  // @UseGuards(AuthGuard('jwt'))
  updatePiggyBank(@Body() updatePiggyBankInfo: UpdatePiggyBankDto) {
    return this.piggyBankService.updatePiggyBank(updatePiggyBankInfo);
  }

  @Delete('delete')
  // @UseGuards(AuthGuard('jwt'))
  deletePiggyBank(@Body() deletePiggyBankDto: DeletePiggyBankDto) {
    return this.piggyBankService.removePiggyBank(deletePiggyBankDto);
  }
}
